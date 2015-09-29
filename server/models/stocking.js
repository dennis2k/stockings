var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var now = new Date().getTime();
var model = mongoose.model('stocklocations', new mongoose.Schema({
  name : { type: String, required: true },
  address : String,
  city : String,
  zip : String,
  country : String,
  create_time : {type : Number, default : now},
  update_time : Number,
  delete_time : Number  
}));

module.exports = model;