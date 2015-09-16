var express = require('express'),
    mongoose = require('mongoose'),    
    router = express.Router(),
    Product = require('../models/product');

mongoose.connect('mongodb://fiskepind1337:bandithalm1337@ds027819.mongolab.com:27819/stockingdb'); // connect to our database  

router.use('/products', require('./product.controller'))


module.exports = router