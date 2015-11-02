var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.static('public/pages'));

app.get('/', function (req, res) {
  res.redirect('/index.html');
});

app.get('/tor-hidden-services-for-beginners', function (req, res) {
  res.redirect('/tor-hidden-services-for-beginners.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
