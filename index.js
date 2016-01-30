
/*

  index.js

  Entry point for sneakers.

*/


var yargs = require("yargs"),
    fs    = require("fs"),
    chalk = require("chalk"),
    cli   = require("./cli/"),
    utils = require("./server/utils"),
    argv  = yargs.argv._,
    cmd;


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
cmd = argv.shift() || "start";

// Run command
cli(cmd, argv);
