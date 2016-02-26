/**

  cli-utils.js

  Helper functions for cli interface.

**/


//
//  Dependencies
//

var chalk = require("chalk"),
    fs = require("fs");


//
//  Exports
//

var utils = module.exports = {};



/**

  Right appends spaces to a string

  @param {String} str Base string
  @param {Number} len Desired length
  @returns {String} The padded string

**/

utils.pad = function(str, len) {
  while (str.length < len) str += " ";
  return str;
};



/**

  Sorts and outputs strings in a grid format.

  @param {Array} grid Array of lines, where each line has two cells (e.g. ["A", "B"])
  @param {Number} options.len Length of each column
  @param {String} [options.title] Title to display above the grid
  @param {Array} [options.headers] Array of strings containing column headers

**/

utils.showGrid = function(grid, options) {

  var str, i, j, m, n;

  options = options || {};
  if ("undefined" === typeof options.sort) options.sort = true;

  if (options.sort)
    grid.sort(function(a, b) {
      return (a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0;
    });

  console.log("");

  if (options.title) {
    console.log(" " + chalk.cyan(options.title));
    console.log("");
  }

  if (options.headers) {
    str = "    ";
    for (j = 0, m = options.headers.length; j < m; j++)
      str += utils.pad(options.headers[j], options.len);
    console.log(chalk.yellow(str));
  }

  for (i = 0, n = grid.length; i < n; i++) {
    str = "    ";
    for (j = 0, m = grid[i].length; j < m; j++)
      str += utils.pad(grid[i][j], options.len);
    console.log(str);
  }

  console.log("");

};


/**

  Reads a file in (avoids `require("fs")` at the top of each file)

  @param {String} p Path to the file
  @returns {String} Contents of file

**/

utils.readFile = function(p) {
  return require("fs").readFileSync(p, "utf8");
};
