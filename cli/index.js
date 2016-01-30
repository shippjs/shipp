
/*

  cli.js

*/

var fs       = require("fs"),
    chalk    = require("chalk"),
    utils    = require("../server/utils"),
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


module.exports = function(cmd, args) {

  // Throw error if command doesn't exist
  if (!commands[cmd]) {
    console.log(chalk.red("Error:") + " That command doesn't exist! Try one of these...");
    help();
    process.exit();
  }

  // Run the command
  commands[cmd].apply(null, args || []);

}


function add() {
  console.log("Add");
}


function compilers() {
  console.log("Compilers");
}


function debug() {
  console.log("Debug");
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