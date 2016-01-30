
/*

  index.js

*/

module.exports = function() {

  var server = require("./server");

  // Start the server
  server();

  // Start browser sync and proxy
  global.server.init({
    proxy: "localhost:27182"
  });

}