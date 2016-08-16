'use strict';

var http = require("http");
var morgan = require("morgan");
var express = require('express');
var session = require('express-session');
var helmet = require("helmet");
var querystring = require("querystring");
var bodyParser = require('body-parser');
var config = require('config');
var path = require('path');

var app = express();

app.use(morgan('dev'));
app.use(helmet());

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
  limit: '10mb'
}));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.use(session({
  cookie: {
    maxAge: 900000
  },
  secret: '123456',
  resave: false,
  saveUninitialized: true
}));

var login = require('./lib/routes/login.js');
var  get  = require('./lib/routes/get.js');
var  post = require('./lib/routes/post.js');

//Routes
app.use('/', login);
app.use('/', get);
app.use('/', post);

var port = process.env.PORT || config.port || 3003;

app.listen(port, function() {
  console.log('Ejecutando en el puerto ' + port);
});
