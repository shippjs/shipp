
/*

  cli.js

*/

var yargs    = require("yargs"),
    fs       = require("fs"),
    chalk    = require("chalk"),
    utils    = require("../server/utils"),
    argv     = yargs.argv._,
    commands = {
      add       : add,
      compilers : compilers,
      debug     : debug,
      help      : help,
      init      : init,
      install   : install,
      remove    : remove,
      start     : start,
      status    : status,
      update    : update
    };


module.exports = function() {

  cmd = argv.shift() || "start";

  // Throw error if command doesn't exist
  if (!commands[cmd]) {
    console.log(chalk.red("Error:") + " That command doesn't exist! Try one of these...");
    help();
    process.exit();
  }

  // Run the command
  commands[cmd].apply(null, argv || []);

}


function add() {
  console.log("Add");
}


function compilers() {
  console.log("Compilers");
}


function debug() {
  global.debug = true;
  if (!/\bsneakers\b/.test(process.env.DEBUG))
    process.env.DEBUG = ((process.env.DEBUG || "") + ",sneakers").replace(/^,/, "");
  start();
}


function help() {
  console.log("Help");
}


function init() {
  console.log("Init");
}


function install() {
  console.log("install");
}


function remove() {
  console.log("remove");
}


function start() {
  console.log("Starting server...");
  require("../server/")();
}


function status(showDebug) {
  return true;
}


function update() {
  console.log("update");
}
