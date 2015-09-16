var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9123;        // set our port

app.use(require('./controllers'))

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);