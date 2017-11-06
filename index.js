var express = require('express');
var app = express();

var AWS = require('aws-sdk')
var s3 = new AWS.S3();
var params = {
  Bucket: "lakecounty",
  MaxKeys: 10
}
s3.listObjects(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else console.log(data.Contents.length);
});

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
