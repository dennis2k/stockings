var express = require('express')
  , router = express.Router()
  , Product = require('../models/product')

router.route('/').post(function(req, res) {        
    var product = new Product();      // create a new instance of the Bear model
    product.name = req.body.name;  // set the bears name (comes from the request)

    // save the bear and check for errors
    product.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Product created!' });
    });        
});

router.route('/').get(function(req, res) {
    Product.find(function(err, products) {
        if (err)
            res.send(err);

        res.json(products);
    });
});
    
router.route('/:product_id').get(function(req, res) {
    Product.findById(req.params.product_id, function(err, product) {
        if (err) res.send(err);
        res.json(product);
    });
})

router.route('/:product_id').put(function(req, res) {
    // use our bear model to find the bear we want
    Product.findById(req.params.product_id, function(err, product) {
        if (err) res.send(err);

        product.name = req.body.name;  // update the bears info            
        product.save(function(err) {
            if (err)
                res.send(err);
            res.json(product);
        });
    });
})
    
router.route('/:product_id').delete(function(req, res) {
    Product.remove({
        _id: req.params.product_id
    }, function(err, product) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
});


module.exports = router