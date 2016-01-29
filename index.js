
/*

  index.js

*/

// Set up globals
require("./lib/globals")();

module.exports = function() {

  var server = require("./lib/main");

  // Start the server
  server();

  // Start browser sync and proxy
  global.server.init({
    proxy: "localhost:27182"
  });

}