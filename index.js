var express = require('express');
var app = express();

  
var fs = require('fs');

var AWS = require('aws-sdk')
var s3 = new AWS.S3();


function get_folder_contents(folder) {
  var params = {
    Bucket: "lakecounty",
    Prefix: folder + "/",
    MaxKeys: 1000
  }
  var key
  s3.listObjects(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      return;
    }
    else {
      var out = "<ul style=\"margin-left:150px;\">"
      for (var i = 0; i < data.Contents.length; ++i) {
        key =data.Contents[i].Key;
        var display_text = key.split("/")[1].replace(/_/g, " ")
        if (display_text.length > 0) {
          var line = "<li><a href=\"https://s3.us-east-2.amazonaws.com/lakecounty/"
          line += key
          line += "\">"
          line += display_text
          line += "</a>"
          line += "</li>"
          out += line
        }
      }
      out += "</ul>"
      fs.writeFile("/tmp/" + folder + ".ejs", out, function(err) {
          if(err) {
              return console.log(err);
          }

          console.log("The file " + folder + " was saved!");
      });
    }
  });
}

function get_text_file(file) {
  var params = {
    Bucket: "lakecounty",
    Key: "text/" + file + ".txt",
  }
  s3.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      var out = data.Body.toString('ascii');
      fs.writeFile("/tmp/" + file + ".ejs", out, function(err) {
          if(err) {
              return console.log(err);
          }

          console.log("The text " + file  + " was saved!");
      });
    }
  });
}

function get_all() {
  get_folder_contents("about_our_providers")
  get_folder_contents("for_our_providers")
  get_folder_contents("utilization_management")
  get_folder_contents("quality_improvement")
  get_folder_contents("lcpa_events")
  get_folder_contents("lcpa_meeting_calendar")

  get_text_file("index_text")
  get_text_file("about_text")
  get_text_file("immediate_care_text")
  get_text_file("contact_text")
  get_text_file("providers_text")
  get_text_file("plan_text")
  get_text_file("staff_text")
}

get_all()

var interval_seconds = 30;
setInterval(function(){
  get_all()
}, interval_seconds * 1000);


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/*.pdf', function(request, response) {
  response.download('public/res/' + request.url);
});

app.get('/*.xlsx', function(request, response) {
  response.download('public/res/' + request.url);
});

app.get('/*.doc', function(request, response) {
  response.download('public/res/' + request.url);
});

app.get('/*.docx', function(request, response) {
  response.download('public/res/' + request.url);
});

app.get('/*', function(request, response) {
  response.render('pages' + request.url);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
