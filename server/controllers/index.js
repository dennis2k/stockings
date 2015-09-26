var restify = require('express-restify-mongoose');
var express = require('express');
var mongoose = require('mongoose');        
var router = express.Router();

mongoose.connect('mongodb://fiskepind1337:bandithalm1337@ds027819.mongolab.com:27819/stockingdb'); // connect to our database  

restify.serve(router, require('../models/product'));
restify.serve(router, require('../models/category'));

module.exports = router