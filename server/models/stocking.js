var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var now = new Date().getTime();
var model = mongoose.model('stockings', new mongoose.Schema({
  location : { type: String, required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref : 'products' },
  count : Number,
  create_time : {type : Number, default : now},
  update_time : Number,
  delete_time : Number,  
  movements : [{ 
	  adjustment : Number,
	  adjusted_by : String,
    timestamp : {type : Number, default : now}
  }]
}));

module.exports = model;