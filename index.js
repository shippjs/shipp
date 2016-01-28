
/*

  index.js

*/

module.exports = function() {

  var app    = require("./lib/server"),
      bs     = require("browser-sync").create(),
      config = require("./lib/config")();

  // Attach to the global namespace
  global.bs = bs;

  // Start the app
  app();

  // Start browser sync and proxy
  bs.init({
    proxy: "localhost:27182"
  });

}