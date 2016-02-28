/**

  middleware-editor.js

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

    Outputs a list of middleware.

  **/

  list: function() {

    var editor = require("./config-editor"),
        middleware = editor.get("middleware"),
        columns = [];

    for (var key in middleware)
      columns.push([key, middleware[key].join(", ")]);

    utils.showGrid(columns, {
      title   : "Middleware:",
      len     : 20,
      headers : ["Position", "Packages"],
      sort    : false
    });

  },



  /**

    Adds custom middleware to the stack. Valid positions include: beforeAll,
    beforeRoutes, afterRoutes and errorHandler

    @param {String} position The middleware position
    @param {String} pkg The name of the package

  **/

  add: function(position, pkg) {

    var editor = require("./config-editor"),
        positions = ["beforeAll", "beforeRoutes", "afterRoutes", "errorHandler"],
        middleware = editor.get("middleware");

    console.log("");

    if (-1 === positions.indexOf(position)) {
      console.log(chalk.red("   Error: ") + "position must be one of " + chalk.yellow(positions.join(chalk.white(", "))));
    } else {
      if (middleware[position].indexOf(pkg) > -1)
        console.log("   " + chalk.red("No Change:") + " "  + chalk.yellow(pkg) + " was already in " + chalk.yellow(position));
      else {
        middleware[position].push(pkg);
        editor.set("middleware." + position, middleware[position]);
        editor.save();
        console.log("   " + chalk.cyan("Added:") + " " + chalk.yellow(pkg) + " added to " + chalk.yellow(position));
      }
    }

    console.log("");

  },


  /**

    Removes custom middleware from the stack. Valid positions include: beforeAll,
    beforeRoutes, afterRoutes and errorHandler

    @param {String} position The middleware position
    @param {String} pkg The name of the package

  **/

  remove: function(position, pkg) {

    var editor = require("./config-editor"),
        positions = ["beforeAll", "beforeRoutes", "afterRoutes", "errorHandler"],
        middleware = editor.get("middleware");

    console.log("");

    if (-1 === positions.indexOf(position)) {
      console.log(chalk.red("   Error: ") + "position must be one of " + chalk.yellow(positions.join(chalk.white(", "))));
    } else {
      if (middleware[position].indexOf(pkg) === -1)
        console.log("   " + chalk.red("No Change:") + " "  + chalk.yellow(pkg) + " wasn't in " + chalk.yellow(position));
      else {
        middleware[position].splice(middleware[position].indexOf(pkg), 1);
        editor.set("middleware." + position, middleware[position]);
        editor.save();
        console.log("   " + chalk.cyan("Removed:") + " " + chalk.yellow(pkg) + " removed from " + chalk.yellow(position));
      }
    }

    console.log("");

  }

};
