
module.exports = function() {

  var PORT       = 8080,
      path       = require("path"),
      express    = require("express"),
      server     = express(),
      scripts    = require("./lib/scripts");


  // Set up sensible logging defaults, etc.

  // Add routers
  server.use(require("./lib/fonts.js")());
  server.use(require("./lib/images.js")());
  server.use(require("./lib/styles.js")());
  server.use(require("./lib/views.js")());

  // Add scripts for in-house and vendor files
  server.use(scripts());
  server.use(scripts({ path : "./vendor", url : "/vendor" }));

  // We must add the data last or it overwrites other paths
  server.use(require("./lib/data.js")());

  // Find next port
  function listen() {

    server.listen(PORT, function(err) {
      server.once("close", function() {
        console.log("Server closed, trying next port...");
      });
      console.log("Server listening on port", PORT);
    });

    server.on("error", function(err) {
      server.close();
      PORT++;
      listen();
    });

  }

  listen();

}
