
/**

  data-editor

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

    Writes a list of data directories being used.

  **/

  list: function() {

    var editor = require("./config-editor"),
        data   = (editor.get("data") || []).slice(0),
        str;

    console.log("");
    if (!data.length)
      console.log(chalk.cyan("   Info:"), "there are no data directories in your project");
    else {
      str = chalk.yellow(data.pop());
      if (data.length) {
        for (var i = 0; i < data.length; i++) data[i] = chalk.yellow(data[i]);
        str = (data.join(", ") + " and " + str).replace(/\s\s+/g, "");
      }
      console.log(chalk.cyan("   Info:"), "current data directories include", str);
    }

    console.log("");

  },



  /**

    Adds a data folder and acknolwedges with confirmation.

    @param {String} folder The location of the data directory

  **/

  add: function(folder) {

    var editor = require("./config-editor"),
        data   = (editor.get("data") || []).slice(0);

    console.log("");

    if (data.indexOf(folder) > -1) {
      console.log("   " + chalk.red("No Change:") + " your data directories already include " + chalk.yellow(folder));
    } else {
      data.push(folder);
      editor.set("data", data);
      editor.save();
      console.log("   " + chalk.cyan("Added:") + " sneakers now includes " + chalk.yellow(folder) + " in your data directory");
    }

    console.log("");

  },


  /**

    Removes a data folder and acknolwedges with confirmation.

    @param {String} folder The location of the data directory

  **/

  remove: function(folder) {

    var editor = require("./config-editor"),
        data   = (editor.get("data") || []).slice(0);

    console.log("");

    if (data.indexOf(folder) === -1) {
      console.log("   " + chalk.red("No Change:") + " your data directories didn't include " + chalk.yellow(folder));
    } else {
      data.splice(data.indexOf(folder))
      editor.set("data", data);
      editor.save();
      console.log("   " + chalk.cyan("Removed:") + " sneakers no longer includes " + chalk.yellow(folder) + " in your data directory");
    }

    console.log("");

  }

};
