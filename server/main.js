var express = require('express');
var path = require('path');

startServer();

// Start the server
function startServer() {
  var app = express();

  var isProduction = process.env.NODE_ENV === 'production';
  var port = isProduction ? process.env.PORT : 5000;
  var publicPath = path.resolve(__dirname, '../public');

  // Views is directory for all template files
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  // Initialize middleware
  app.use(express.static(publicPath));

  // Set app default data
  app.locals.metaTitle = 'login-with-singular';

  // Router
  require(__dirname + '/router')(app);

  // Run production server
  app.listen(port, function () {
    console.log('Production server running on port ' + port);
  });
}