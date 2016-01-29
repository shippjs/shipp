
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
      database = require("./database"),
      scripts  = require("./scripts"),
      statics  = require("./statics"),
      styles   = require("./styles"),
      views    = require("./views");

  // Set up sensible logging defaults, etc.
  server.use(cookies());
  server.use(sessions({ secret : "password123", resave : false, saveUninitialized : true }));

  // Get JSON data (for database and view-rendering)
  global.db = database();

  // Middleware helper
  function middleware(fn) {
    return function(options) { server.use(fn(options)); }
  }

  // Add routers
  config.styles.forEach(middleware(styles));
  server.use(require("./views.js")());

  // Add scripts for in-house and vendor files
  config.scripts.forEach(middleware(scripts));

  // Add statics
  config.fonts.forEach(middleware(statics));
  config.images.forEach(middleware(statics));
  config.statics.forEach(middleware(statics));

  // We must add the data last or it overwrites other paths
  server.use(require("./api")());

  // Listen (we will proxy with browser sync)
  server.listen(PORT);

}
