var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var methodOverride = require('method-override');
var restify = require('express-restify-mongoose')
var basicAuth = require('basic-auth-connect');
var morgan      = require('morgan');
var favicon = require('serve-favicon');

var path = require('path')

//Serve favico
app.use(favicon(__dirname + '/app/assets/img/fav.ico'));

//Help server angular pages
app.use(express.static(__dirname + '/app'));

// configure app to use bodyParser()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride())

//Log request
app.use(morgan('dev'));

//Add token auth middleware
app.use(require('./server/middlewares/token-auth'))

//Add routes
app.use(require('./server/controllers'),require('./server/controllers/auth'))

//Serve angular
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/app/index.html'))
});

//Run server
app.listen(80);
console.log('Magic happens on port ' + 80);