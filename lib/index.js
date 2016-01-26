
module.exports = function() {

  var PORT       = 8080,
      path       = require("path"),
      express    = require("express"),
      server     = express(),
      scripts    = require("./scripts");


  // Set up sensible logging defaults, etc.

  // Add routers
  server.use(require("./fonts.js")());
  server.use(require("./images.js")());
  server.use(require("./styles.js")());
  server.use(require("./views.js")());

  // Add scripts for in-house and vendor files
  server.use(scripts());
  server.use(scripts({ path : "./vendor", url : "/vendor" }));

  // We must add the data last or it overwrites other paths
  server.use(require("./data.js")());

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
