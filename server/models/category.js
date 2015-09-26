var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var model = mongoose.model('categories', new mongoose.Schema({
  name: { type: String, required: true }
}))

module.exports = model;