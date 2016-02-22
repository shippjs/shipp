
/**

  index.js

  Entry point for sneakers.

**/


var cli = require("./cli/");

// Set up globals
require("./server/globals")();

// Parse commands
cli();
