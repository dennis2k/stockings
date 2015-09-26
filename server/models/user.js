var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var model = mongoose.model('users', new mongoose.Schema({
  email: { type: String, required: true },
  password : String,
  admin : Boolean
}));

module.exports = model;