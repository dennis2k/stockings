var express    = require('express');
var app        = express();      
var router = express.Router();
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'lfv2tm';
var users = require('../models/user');
var jwt    = require('jsonwebtoken');

router.post('/authenticate', function(req, res) {
  
  console.log(encrypt(req.body.password));
  // find the user
  users.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      return res.send(401, 'Unauthorized');
    } else if (user) {

      // check if password matches
      if (user.password != encrypt(req.body.password)) {
        return res.send(401, 'Unauthorized');
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user,"fuckingfizz", {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});


function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
module.exports = router;
