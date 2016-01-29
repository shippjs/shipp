
/*

  Server.js

*/

module.exports = function() {

  var PORT     = 27182,
      path     = require("path"),
      express  = require("express"),
      server   = express(),
      cookies  = require("cookie-parser"),
      sessions = require("express-session"),
      config   = require("./config")(),
      compiled = require("./compiled"),
      database = require("./database"),
      statics  = require("./statics"),
      views    = require("./views");

  // Set up sensible logging defaults, etc.
  server.use(cookies());
  server.use(sessions({ secret : "password123", resave : false, saveUninitialized : true }));

  // Get JSON data (for database and view-rendering)
  global.db = database();

  // Middleware helper
  function iterateMiddleware(arr, middleware) {
    arr.forEach(function(options) { server.use(middleware(options)); });
  }

  // Add routers
  server.use(require("./views.js")());

  // Add compiled
  iterateMiddleware(config.styles, compiled);
  iterateMiddleware(config.scripts, compiled);

  // Add statics
  iterateMiddleware(config.fonts, statics);
  iterateMiddleware(config.images, statics);
  iterateMiddleware(config.statics, statics);

  // We must add the data last or it overwrites other paths
  server.use(require("./api")());

  // Listen (we will proxy with browser sync)
  server.listen(PORT);

}
