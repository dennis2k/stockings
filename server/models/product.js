var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var model = mongoose.model('products', new mongoose.Schema({
  name: { type: String, required: true },
  description : String,
  cost_price : Number,
  retail_price : Number,
  categories : String, 
  stockings : [
    {
      stock_location_id : {type : mongoose.Schema.Types.ObjectId, ref : 'stocklocations'  },
      current_stock : Number,
      movements : [
        {
          adjustment : Number,
          timestamp : {type : Number, default : new Date().getTime()},
        }
      ]
    }
  ],
  create_time : {type : Number, default : new Date().getTime()},
  update_time : Number,
  delete_time : Number
}));

module.exports = model;