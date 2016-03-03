/**

  cli

**/


//
//  Dependencies
//

var program    = require("commander"),
    chalk      = require("chalk"),
    data       = require("./data-editor"),
    middleware = require("./middleware-editor"),
    pipelines  = require("./pipelines-editor"),
    routes     = require("./routes-editor"),
    utils      = require("./cli-utils"),
    vars       = require("./vars-editor");



//
//  Exports
//

module.exports = function() {

  var command = process.argv[2];

  // Set start as default argument
  if ("undefined" == typeof process.argv[2]) process.argv[2] = "help";

  program
    .version("0.7.0");

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
      vars.listEnvs();
      vars.listLocals();
      middleware.list();
      pipelines.list();
      routes.list();
    });

  program
    .command("data")
    .action(data.list);

  program
    .command("data:add <folder> [route]")
    .action(data.add);

  program
    .command("data:remove <folder>")
    .action(data.remove);

  program
    .command("defaults")
    .action(listDefaults);

  program
    .command("defaults:restore")
    .action(restoreDefaults);

  program
    .command("env")
    .action(vars.listEnvs);

  program
    .command("env:add <key> <value>")
    .action(vars.addEnv);

  program
    .command("env:remove <key>")
    .action(vars.removeEnv);

  program
    .command("locals")
    .action(vars.listLocals);

  program
    .command("locals:add <key> <value>")
    .action(vars.addLocal);

  program
    .command("locals:remove <key>")
    .action(vars.removeLocal);

  program
    .command("middleware")
    .action(middleware.list);

  program
    .command("middleware:add <position> <package>")
    .action(middleware.add);

  program
    .command("middleware:remove <position> <package>")
    .action(middleware.remove);

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

  program.parse(process.argv);

};



/**

  Starts the server

**/

function start(env) {

  var server = require("../server/");

  // Start the server
  console.log(chalk.green.bold("\nStarting server...\n"));

  if (/^prod/i.test(env)) {
    process.env.NODE_ENV = "production";
    server();
  } else {
    // Start browser sync and proxy
    server({ liveRefresh: true }, function() {
      global.server.init({ proxy : "localhost:" + global.ports.server });
    });
  }

}


/**

  Shows help on commands

**/

function showHelp() {

  var columns = [];

  console.log("");
  console.log("To start the server, run", chalk.magenta("shipp start"));
  console.log("");
  console.log(chalk.cyan(" Usage:"));
  console.log("");
  console.log("    " + chalk.magenta("shipp") + chalk.yellow(" <command> [<args>]"));
  console.log("");
  console.log(chalk.cyan(" Commands:"));
  console.log("");

  readHelpFile("main.json").forEach(listCommand);

}


/**

  Helper to read in a file from the help directory

**/

function readHelpFile(filename) {
  return JSON.parse(utils.readFile(require("path").join(__dirname, "help", filename), "utf8"));
}


/**

  Helper to list a command, properly spaced

**/

function listCommand(command, description) {

  var key = command.command;

  // Allow for blank line
  if ("" === key) return console.log("");

  // Pad key
  key = utils.pad(key, 39);

  // Replace <commands> with yellow
  key = key.replace(/\"?<[^>]+>\"?/g, function(x) { return chalk.yellow(x); });
  console.log("    " + key + "  " + command.description);

}



/**

  Lists defaults

**/

function listDefaults() {

  require("./config-editor").loadDefaults();

  console.log("");
  console.log(chalk.magenta(" Note:"), "The following settings are the defaults and may or may not reflect your");
  console.log("       app's configuration. To see your config, use the", chalk.yellow("config"), "command. To");
  console.log("       restore defaults, use the", chalk.yellow("defaults:restore"), "command.");

  data.list();
  vars.listEnvs();
  vars.listLocals();
  middleware.list();
  pipelines.list();
  routes.list();

}



/**

  Deletes the shipp.json file and restores defaults.

**/

function restoreDefaults() {

  var str;

  console.log("");
  str  = chalk.red("   Warning!") + " This command will delete your ";
  str += chalk.yellow("shipp.json") + " file (using default options instead)";
  console.log(str);
  console.log("   To continue type DELETE and press enter.");

  process.stdout.write("   > ");

  process.stdout.on("data", function(res) {
    console.log("");
    res = res.toString().trim();

    if (/^delete$/i.test(res)) {
      console.log("   We've restored defaults by deleting your", chalk.yellow("shipp.json"), "file");
      require("./config-editor").remove();
    } else
      console.log("   Nothing done. Come back if you need us.");

    console.log("");
    process.exit();
  });

}
