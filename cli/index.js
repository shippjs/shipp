
/*

  cli.js

*/

var program = require("commander"),
    chalk = require("chalk"),
    fs = require("fs"),
    path = require("path");


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
    .action(listPipelines);

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


function pad(str, len) {
  while (str.length < len) str += " ";
  return str;
}


function listCommand(command, description) {

  var key = command.command;

  // Allow for blank line
  if ("" === key) return console.log("");

  // Pad key
  key = pad(key, 35);

  // Replace <commands> with yellow
  key = key.replace(/\<[^\>]+\>/g, function(x) { return chalk.yellow(x) });;
  console.log("    " + key + "  " + command.description);
}


function showGrid(grid, options) {

  options = options || {};

  grid.sort(function(a, b) {
    return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0;
  });

  console.log("");

  if (options.title) {
    console.log(" " + chalk.cyan(options.title));
    console.log("");
  }

  if (options.headers)
    console.log(chalk.yellow("    " + pad(options.headers[0], options.len) + options.headers[1]));

  for (var i = 0, n = grid.length; i < n; i++)
    console.log("    " + pad(grid[i][0], options.len) + grid[i][1]);

  console.log("");

};


function showHelp() {

  console.log("");
  console.log(chalk.cyan(" Usage:"));
  console.log("");
  console.log("    " + chalk.magenta("sneakers") + chalk.yellow(" <command> [<args>]"));
  console.log("");
  console.log(chalk.cyan(" Commands:"));
  console.log("");

  var help = JSON.parse(fs.readFileSync(path.join(__dirname, "./help/main.json"), "utf8"));

  help.forEach(listCommand);

}


function start() {

  console.log(chalk.green.bold("\nStarting server...\n"));
  require("../server/")();

}


function listFolders(type) {

  // Set up globals
  require("../server/globals")();

  var folders = global.config[type].slice(0),
      columns = [];

  folders.forEach(function(folder) {
    columns.push([folder.path, folder.url]);
  });

  type = type[0].toUpperCase() + type.slice(1) + ":";
  showGrid(columns, {
    title   : type,
    len     : 20,
    headers : ["Directory", "Route"]
   });

}


function listPipelines() {

  // Set up globals
  require("../server/globals")();

  var pipelines = Object.assign({}, global.config.engines),
      columns = [];

  for (var key in pipelines)
    columns.push(["*." + key, pipelines[key]])

  showGrid(columns, {
    title   : "Pipelines:",
    len     : 20,
    headers : ["Extension", "Pipeline"]
  });

};
