
/**

  routes-editor

**/


//
//  Dependencies
//

var chalk = require("chalk"),
    utils = require("./cli-utils");



//
//  Exports
//

var Routes = module.exports = {

  /**

    Outputs a list of routes.

  **/

  list: function() {

    var editor = require("./config-editor"),
        routes = editor.get("routes"),
        columns = [];

    for (var route in routes)
      columns.push([route, routes[route].path, routes[route].type, (routes[route].bundleFolders ? "true" : "")]);

    utils.showGrid(columns, {
      title   : "Routes:",
      len     : 20,
      headers : ["Route", "Folder", "Contains", "Bundles Folders"]
    });

  },


  /**

    Adds a route and acknolwedges with confirmation. This function is not
    usually used directory, but rather through helper functions (scripts, etc.)

    @param {String} type The type of files folder contains (scripts, statics, styles, etc.)
    @param {String} route The base route for the folder
    @param {String} folder The folder containing the files
    @param {Array} [options.exts] Array of strings representing permitted file extensions
    @param {Boolean} [options.bundleFolders] If true, automatically bundles appropriate folders

  **/

  add: function(type, route, folder, options) {

    var editor  = require("./config-editor"),
        routes  = editor.get("routes"),
        prev;

    options = options || {};

    // Ensure that leading "./" is removed from folder
    if (/^\.\//.test(folder)) folder = folder.slice(2);

    // Ensure that route has preceeding slash
    if ("/" !== route[0]) route = "/" + route;
    prev = routes[route];

    function suffix(x, y) {
      return "route " + chalk.yellow(x) + " requests to the " + chalk.yellow(y) + " folder";
    };

    console.log("");

    // Remove if existing
    if (prev) {
      if (prev.path === folder) {
        console.log("   " + chalk.cyan("No Change:") + " sneakers will already " + suffix(prev.url, prev.path));
        console.log("");
        return;
      }
      console.log("   " + chalk.cyan("Removed:") + " sneakers will no longer " + suffix(prev.url, prev.path));
    }

    // Add new
    obj = { type : type, path : folder, url : route };
    if (options.exts) obj.exts = options.exts;
    if (options.bundleFolders) obj.bundleFolders = true;

    editor.set("routes." + route, obj);
    editor.save();

    console.log("   " + chalk.cyan("Added:") + " sneakers will " + suffix(route, folder));
    console.log("");

  },


  /**

    Removes a route and acknowledges with confirmation.

    @param {String} route The route to remove

  **/

  remove: function(route) {

    var editor  = require("./config-editor"),
        routes  = editor.get("routes"),
        prev;

    // Ensure that route has preceeding slash
    if ("/" !== route[0]) route = "/" + route;
    prev = editor.get("routes." + route);

    editor.unset("routes." + route);
    editor.save();

    console.log("");

    if ("undefined" === typeof prev)
      console.log("   " + chalk.red("No Change:") + " there was no route called " + chalk.yellow(route));
    else
      console.log("   " + chalk.cyan("Removed:") + " route " + chalk.yellow(route) + " has been removed");

    console.log("");

  },


  /**

    Helper function to add a scripts folder

    @param {String} route The base route for the folder
    @param {String} folder The folder containing the files
    @param {Boolean} [options.bundleFolders] If true, automatically bundles appropriate folders

  **/

  scripts: function(route, folder, bundleFolders) {
    bundleFolders = ("false" !== bundleFolders);
    Routes.add("views", route, folder, { exts : ["js"], bundleFolders : bundleFolders });
  },


  /**

    Helper function to add a statics folder

    @param {String} route The base route for the folder
    @param {String} folder The folder containing the files

  **/

  statics: function(route, folder) {
    Routes.add("statics", route, folder);
  },


  /**

    Helper function to add a styles folder

    @param {String} route The base route for the folder
    @param {String} folder The folder containing the files

  **/

  styles: function(route, folder) {
    Routes.add("styles", route, folder, { exts : ["css"] });
  },


  /**

    Helper function to add a views folder

    @param {String} route The base route for the folder
    @param {String} folder The folder containing the files

  **/

  views: function(route, folder) {
    Routes.add("views", route, folder, { exts : ["html"] });
  }

};
