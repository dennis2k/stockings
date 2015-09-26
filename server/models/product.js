var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var model = mongoose.model('products', new mongoose.Schema({
  name: { type: String, required: true },
  description : String,
  categories: { type: Array },
  stockings : [
    { type: mongoose.Schema.Types.ObjectId, ref : 'stockings' },
  ]
}));

module.exports = model;