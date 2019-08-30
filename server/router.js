var superagent = require('superagent');

var SINGULAR_SERVER = 'https://singular-staging4.herokuapp.com';
var CLIENT_ID = 'f6fce93827c5f8b2684ac18ffcbe0f6734eb7daa7927590abba1aeb78199267c1e6e380500b322bfa4647f2e2ebb84d3';
var CLIENT_SECRET = '358fbdbd5b60313a3946eb6efd788661f3be1afded6f7391d465832327fa207a17d7d1ea1279486055433847612e3838';

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
            res.json('Your name is ' + userRes.body.name + ' with email address ' + userRes.body.email);
          });
        }
      });
  });
};