
/*

  cli.js

*/

var program   = require("commander"),
    chalk     = require("chalk"),
    data      = require("./data-editor"),
    locals    = require("./locals-editor"),
    pipelines = require("./pipelines-editor"),
    routes    = require("./routes-editor"),
    utils     = require("./cli-utils");


module.exports = function() {

  program
    .version("0.7.0")

  program
    .command("start")
    .action(start);

  program
    .command("help")
    .action(showHelp);

  program
    .command("config")
    .action(function() {
      data.list();
      locals.list();
      pipelines.list();
      routes.list();
    });

  program
    .command("data")
    .action(data.list);

  program
    .command("data:add <folder>")
    .action(data.add);

  program
    .command("data:remove <folder>")
    .action(data.remove);

  program
    .command("locals")
    .action(locals.list);

  program
    .command("locals:add <key> <value>")
    .action(locals.add);

  program
    .command("locals:remove <key>")
    .action(locals.remove);

  program
    .command("pipelines")
    .action(pipelines.list);

  program
    .command("pipelines:add <extension> <pipeline>")
    .action(pipelines.add);

  program
    .command("pipelines:remove <extension>")
    .action(pipelines.remove);

  program
    .command("routes")
    .action(routes.list);

  program
    .command("routes:scripts <route> <folder> <bundleFolders>")
    .action(routes.scripts);

  program
    .command("routes:statics <route> <folder>")
    .action(routes.statics);

  program
    .command("routes:styles <route> <folder>")
    .action(routes.styles);

  program
    .command("routes:views <route> <folder>")
    .action(routes.views);

  program
    .command("routes:remove <route>")
    .action(routes.remove);

  // Set start as default argument
  if ("undefined" == typeof process.argv[2]) process.argv[2] = "help";
  program.parse(process.argv);

};



/**

  Starts the server

**/

function start() {

  var server = require("../server/");

  // Start the server
  console.log(chalk.green.bold("\nStarting server...\n"));
  server({
    liveRefresh: true
  });

  // Start browser sync and proxy
  global.server.init({ proxy : "localhost:" + global.ports.proxy });

}

function showHelp() {

  console.log("");
  console.log(chalk.cyan(" Usage:"));
  console.log("");
  console.log("    " + chalk.magenta("sneakers") + chalk.yellow(" <command> [<args>]"));
  console.log("");
  console.log(chalk.cyan(" Commands:"));
  console.log("");

  readHelpFile("main.json").forEach(listCommand);

}



readHelpFile = function(p) {
  return JSON.parse(utils.readFile(require("path").join(__dirname, "help", "main.json"), "utf8"));
}


listCommand = function(command, description) {

  var key = command.command;

  // Allow for blank line
  if ("" === key) return console.log("");

  // Pad key
  key = utils.pad(key, 39);

  // Replace <commands> with yellow
  key = key.replace(/\"?\<[^\>]+\>\"?/g, function(x) { return chalk.yellow(x) });;
  console.log("    " + key + "  " + command.description);
}
