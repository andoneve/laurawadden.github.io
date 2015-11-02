var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.static('public/pages'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/tor-hidden-services-for-beginners', function (req, res) {
  res.sendFile('/tor-hidden-services-for-beginners.html');
});

app.listen(3000);
