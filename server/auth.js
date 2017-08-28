var basicAuth = require('basic-auth');

module.exports = {
  auth: auth
};

function auth(expectedCreds){
  return function(req, res, next) {
    var creds = basicAuth(req);

    if (!creds || !creds.name || !creds.pass) {
      return unauthorized(res);
    }

    if ((creds.name === expectedCreds.name) && (creds.pass === expectedCreds.pass)) {
      return next();
    } 
    else {
      return unauthorized(res);
    }
  }
}

function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
}