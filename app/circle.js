//#!/usr/bin/env nodejs

var express = require('express');
var app = express();

app.listen(8080);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(function(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.render('index');
});
