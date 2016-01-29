
/*

  index.js

*/

module.exports = function() {

  var server = require("./lib/main"),
      bs     = require("browser-sync").create(),
      config = require("./lib/config")();

  // Attach to the global namespace
  global.bs = bs;

  // Start the server
  server();

  // Start browser sync and proxy
  bs.init({
    proxy: "localhost:27182"
  });

}