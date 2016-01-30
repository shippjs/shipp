
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
      remove    : remove,
      start     : start
    };


module.exports = function() {

  cmd = argv.shift() || "start";

  // Throw error if command doesn't exist
  if (!commands[cmd]) {
    log("error", "That command doesn't exist! Try one of these...");
    help();
    process.exit();
  }

  // Run the command
  console.log("");
  commands[cmd].call(null, argv || []);
  console.log("");

}


function log(type, str) {

  var prefixes = {
    info  : chalk.green("  info: "),
    warn  : chalk.yellow("  warning: "),
    error : chalk.red("  error: ")
  };

  if (!str) { str = type; type = "info"; }

  // Automatically highlight commands
  str = str.replace(/`([^`]+)`/g, function(str, match) { return chalk.cyan(match); });
  console.log(prefixes[type] + str);

}



function add(args) {

  if (!args.length)
    return log("error", "You didn't give a compiler. Try `sneakers add handlebars` or `sneakers add typescript`.");

  log("info", "Adding compilers " + chalk.cyan(args.join(" ")));

}


function compilers() {

  var list = global.config.compilers || [];

  if (!list.length)
    return log("info", "Your project doesn't have any additional compilers. You can add one with `sneakers add <compiler>`")

  log("info", "Your project contains the following compilers:");
  global.config.compilers.forEach(function(compiler) {
    console.log("   • " + compiler)
  });

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
  log("info", "Creating `sneakers.config.js`");
  log("info", "Creating `package.json`");
  log("info", "Installing packages");
}


function remove() {
  console.log("remove");
}


function start() {
  console.log("Starting server...");
  require("../server/")();
}

