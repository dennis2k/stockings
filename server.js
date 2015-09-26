var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var methodOverride = require('method-override');
var restify = require('express-restify-mongoose')
var basicAuth = require('basic-auth-connect');
var morgan      = require('morgan');

var path = require('path')

app.use(express.static(__dirname + '/app'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    } 
    else {
      next(); 
    }
});

// Authenticator
app.set('superSecret', "superdupersecretvariable");


// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride())

//Log request
app.use(morgan('dev'));

app.use(require('./server/middlewares/token-auth'))

app.use(require('./server/controllers'),require('./server/controllers/auth'))

//Serve angular
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/app/index.html'))
});

//Run server
app.listen(80);
console.log('Magic happens on port ' + 80);