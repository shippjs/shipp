
/**

  data-editor

**/


//
//  Dependencies
//

var chalk = require("chalk");



//
//  Exports
//

var dataEditor = module.exports = {

  /**

    Writes a list of data directories being used.

  **/

  list: function() {

    var editor = require("./config-editor"),
        data   = (editor.get("data") || []).slice(0),
        str;

    console.log("");
    console.log(chalk.cyan(" Data:"));
    console.log("");

    if (!data.length)
      console.log("   There are no data directories in your project");
    else {
      str = chalk.yellow(data.pop());
      if (data.length) {
        for (var i = 0; i < data.length; i++) data[i] = chalk.yellow(data[i]);
        str = (data.join(", ") + " and " + str).replace(/\s\s+/g, "");
      }
      console.log("   Current data directories include", str);
    }

    console.log("");

  },


  /**

    Finds a data folder and returns position (similar to indexOf)

    @param {String} folder The name of the folder to find
    @returns {Number} The position (-1 if missing)

  **/

  find: function(folder) {

    var editor = require("./config-editor"),
        data   = (editor.get("data") || []).slice(0);

    for (var i = 0, n = data.length; i < n; i++)
      if ("string" === typeof data[i]) {
        if (folder === data[i]) return i;
      } else {
        if (folder === data[i].path) return i;
      }

    return -1;

  },


  /**

    Adds a data folder and acknolwedges with confirmation.

    @param {String} folder The location of the data directory
    @param {String} [route] Optional base route (defaults to "/")

  **/

  add: function(folder, route) {

    var editor = require("./config-editor"),
        data   = (editor.get("data") || []).slice(0),
        idx    = dataEditor.find(folder);

    console.log("");

    if (idx > -1)
      console.log("   " + chalk.red("No Change:") + " your data directories already include " + chalk.yellow(folder));
    else {
      data.push(route ? { path : folder, url : route } : folder);
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
