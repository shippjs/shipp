
/**

  locals-editor

**/


//
//  Dependencies
//

var chalk = require("chalk"),
    utils = require("./cli-utils");



//
//  Exports
//

module.exports = {

  /**

    Outputs a list of local variables.

  **/

  list: function() {

    var editor = require("./config-editor"),
        locals = editor.get("locals") || {},
        str;

    console.log("");
    if (!Object.keys(locals).length)
      console.log(chalk.cyan("   Info:"), "there are no local variables in your project");
    else {
      console.log(chalk.cyan("   Local Variables:\n"));
      str = JSON.stringify(locals, null, 2).split("\n").map(function(line) { return "   " + line; }).join("\n");
      console.log(str);
    }

    console.log("");

  },



  /**

    Adds a local variable and acknolwedges with confirmation.

    @param {String} key The key to lookup (supports dot-notation)

  **/

  add: function(key, val) {

    var editor = require("./config-editor");

    console.log("");

    // Perform type casting
    if (val === "false")
      val = false;
    else if (val === "true")
      val = true;
    else if (/^\-?([0-9]+\.?[0-9]*|\.[0-9]*)$/.test(val))
      val = parseFloat(val);

    editor.set("locals." + key, val);
    editor.save();

    console.log("   " + chalk.cyan("Added:") + " local variable " + chalk.yellow(key) + " now contains " + chalk.yellow(val));
    console.log("");

  },


  /**

    Removes a local variable and acknowledges with confirmation.

    @param {String} key The key to remove (supports dot-notation)

  **/

  remove: function(key) {

    var editor = require("./config-editor"),
        prev = editor.get("locals." + key);

    console.log("");

    editor.unset("locals." + key);
    editor.save();

    if ("undefined" === typeof prev)
      console.log("   " + chalk.red("No Change:") + " there was no local variable called " + chalk.yellow(key));
    else if ("object" === typeof prev)
      console.log("   " + chalk.cyan("Removed:") + " local variable " + chalk.yellow(key) + " has been unset");
    else
      console.log("   " + chalk.cyan("Removed:") + " local variable " + chalk.yellow(key) + " has been unset from " + chalk.yellow(prev));
    console.log("");

  }

};
