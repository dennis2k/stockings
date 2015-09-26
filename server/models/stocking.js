var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var model = mongoose.model('stockings', new mongoose.Schema({
  location : { type: String, required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref : 'products' },
  count : Number,  
  movements : [{ 
	  adjustment : Number,
	  adjusted_by : String,
    timestamp : Number
  }]
}));

module.exports = model;