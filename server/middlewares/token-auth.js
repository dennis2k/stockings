var jwt    = require('jsonwebtoken');

var tokenAuth = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  //Skip token check when authenticating
  if(req.originalUrl == "/authenticate")
    return next();
  //Skip token check for angular routes
  if(req.originalUrl.indexOf("/app/") != -1)
    return next();
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'fuckingfizz', function(err, decoded) {      
      if (err) {
        return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });    
  }
}

module.exports = tokenAuth;