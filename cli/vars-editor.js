/**

  locals-editor.js

**/


//
//  Dependencies
//

var chalk = require("chalk"),
    utils = require("./cli-utils");



//
//  Exports
//

var Vars = module.exports = {
  addLocal: function(key, val) {
    Vars.add("locals", key, val);
  },

  listLocals: function() {
    Vars.list("locals", "Locals");
  },


  /**

    Outputs a list of local variables.

    @param key The key to lookup
    @param title The title to output

  **/

  list: function(key, title) {

    var editor = require("./config-editor"),
        vars   = editor.get(key) || {},
        str;

    console.log("");
    console.log(chalk.cyan(" " + title + ":"));
    console.log("");

    if (!Object.keys(vars).length)
      console.log("   There are no " + key + " variables in your project");
    else {
      str = JSON.stringify(vars, null, 2).split("\n").map(function(line) { return "   " + line; }).join("\n");
      console.log(str);
    }

    console.log("");

  },


  /**

    Adds a local variable and acknolwedges with confirmation.

    @param {String} parent Which variable to change (e.g. locals, env)
    @param {String} key The key to lookup (supports dot-notation)
    @param {*} val The value to assign

  **/

  add: function(parent, key, val) {

    var editor = require("./config-editor");

    console.log("");

    // Perform type casting
    if (val === "false")
      val = false;
    else if (val === "true")
      val = true;
    else if (/^\-?([0-9]+\.?[0-9]*|\.[0-9]*)$/.test(val))
      val = parseFloat(val);

    editor.set(parent + "." + key, val);
    editor.save();

    console.log("   " + chalk.cyan("Added:") + " " + parent + " variable " + chalk.yellow(key) + " now contains " + chalk.yellow(val));
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
