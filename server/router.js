var superagent = require('superagent');

var SINGULAR_SERVER = 'https://app.singular.live';
//var SINGULAR_SERVER = 'http://localhost:3000';
var CLIENT_ID = '[_YOUR_CLIENT_ID_]';
var CLIENT_SECRET = '[YOUR_CLIENT_SECRET]';

module.exports = function (app) {

  // Startup page
  app.get('/', function (req, res) {
    res.render('index', {
      singularEndpoint: SINGULAR_SERVER + '/oauth/logindialog?client_id=' + CLIENT_ID
    });
  });

  // Callback
  app.get('/callback', function (req, res) {
    if (!req.query.code) {
      res.status(400).json('No code provided');
      return;
    }

    superagent.post(SINGULAR_SERVER + '/oauth/accesstoken')
      .send({
        code: req.query.code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
      .end(function (tokenErr, tokenRes) {
        if (tokenErr) {
          console.log(tokenErr, tokenRes);
          res.status(500).json('Error from Singular Token');
        } else {
          // Sample call to get loggedin user info
          // Access token should be kept in your database
          var accessToken = tokenRes.body.access_token;
          //console.log(accessToken);
          superagent
          .get(SINGULAR_SERVER + '/apiv1/users/me')
          .set('Authorization', 'Bearer ' + accessToken)
          .end(function(userErr, userRes) {
            //console.log(userRes.body);
            res.send('Your name is ' + userRes.body.name + ' with email address ' + userRes.body.email 
              + '<br/><a href="https://app.singular.live/users/logout">Logout</a>');
          });
        }
      });
  });
};
