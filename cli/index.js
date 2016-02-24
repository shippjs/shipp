
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
      listPipelines()
      listFolders("data");
      listFolders("scripts");
      listFolders("statics");
      listFolders("styles");
      listFolders("views");
    });

  program
    .command("data")
    .action(function() { listFolders("data"); });

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
    .command("scripts")
    .action(function() { listFolders("scripts"); });

  program
    .command("statics")
    .action(function() { listFolders("statics"); });

  program
    .command("styles")
    .action(function() { listFolders("styles"); });

  program
    .command("views")
    .action(function() { listFolders("views"); });

  program
    .command("*")
    .action(function() { console.log("EMPTY!"); });

  // Set start as default argument
  if ("undefined" == typeof process.argv[2]) process.argv[2] = "start";
  program.parse(process.argv);

};


function start() {

  console.log(chalk.green.bold("\nStarting server...\n"));
  require("../server/")();

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
