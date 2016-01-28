
/*

  Server.js

*/

module.exports = function() {

  var PORT       = 27182,
      path       = require("path"),
      express    = require("express"),
      server     = express(),
      scripts    = require("./scripts"),
      cookies    = require("cookie-parser"),
      sessions   = require("express-session"),
      config     = require("./config")(),
      db;


  // Set up sensible logging defaults, etc.
  server.use(cookies());
  server.use(sessions({ secret : "password123", resave : false, saveUninitialized : true }));

  // Get JSON data (for database and view-rendering)
  db = require("./database")();

  // Add routers
  server.use(require("./fonts.js")());
  server.use(require("./images.js")());
  server.use(require("./styles.js")());
  server.use(require("./views.js")(db));

  // Add scripts for in-house and vendor files
  server.use(scripts());
  server.use(scripts({ path : "./vendor", url : "/vendor" }));

  // We must add the data last or it overwrites other paths
  server.use(require("./api")(db));

  // Listen (we will proxy with browser sync)
  server.listen(PORT);

}
