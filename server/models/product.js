var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var model = mongoose.model('products', new mongoose.Schema({
  name: { type: String, required: true },
  description : String,
  categories: { type: Array },
  create_time : {type : Number, default : new Date().getTime()},
  update_time : Number,
  delete_time : Number
}));

module.exports = model;