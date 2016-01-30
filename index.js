
/*

  index.js

  Entry point for sneakers.

*/


var fs    = require("fs"),
    chalk = require("chalk"),
    cli   = require("./cli/"),
    utils = require("./server/utils");


// Ensure project has been initialized
try {
  fs.lstatSync(utils.makePathAbsolute("sneakers.config.js"));
  fs.lstatSync(utils.makePathAbsolute("package.json"));
} catch (err) {
  console.log("You haven't initialized your project. Please run " + chalk.cyan("sneakers init") + " then try again.")
  process.exit(1);
}

// Set up globals
require("./server/globals")();

// Parse commands
cli();
