var bodyParser = require('body-parser');
var helpers = require('./helpers.js'); // our custom middleware
var db = require('../DB/DB.js');
var path = require('path');
var fs = require('fs');
var gm = require('gm');
var cookieParser = require('cookie-parser');
var session = require('express-session');


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations

  app.use(cookieParser());
  //app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));  //rename to whatever the client location is.

  // *********Set up our routes to manage calls to our REST API.

  app.use(session({
    secret: 'shhh, it\'s a secret',
    resave: false,
    saveUninitialized: true
  }));


  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

};