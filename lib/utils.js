
/*

  Utils.js

*/

var __rootDir = process.cwd(),
    fs        = require("fs"),
    url       = require("url"),
    path      = require("path"),
    Utils;


module.exports = Utils = {};


/*

  function getRootPath

*/

Utils.getRootPath = function() {
  return __rootDir;
}



/*

  function makePathAbsolute

*/

Utils.makePathAbsolute = function(p) {

  return path.resolve(Utils.getRootPath(), p || "");

}



/*

  function eachFile

*/

Utils.eachFile = function(p, options, fn) {

  // Allow polymorphism
  if ("function" == typeof options) {
    fn = options;
    options = {};
  }

  // Make path absolute before call (for comparison after)
  p = Utils.makePathAbsolute(p);

  Utils.readDirectory(p, options.recursive).forEach(function(file) {
    file.folder = path.relative(p, file.path.replace(new RegExp(file.base + "$"), ""));
    if (!options.filter || options.filter.indexOf(file.ext) > -1) fn(file);
  });

}



/*

  function makeUrls

*/

Utils.makeUrls = function(route, file, type) {

  var base, slugs;

  type  = ("undefined" == typeof type) ? "" : ("." + type).replace(/\.+/, ".");
  base  = url.resolve((route + "/").replace(/\/\/$/, "/"), file.folder),
  slugs = [url.resolve(base, file.name + type)];

  // HTML files are special cases: we allow the original extension, the "html"
  // extension, and if the file is named "index", we allow it to function as the folder
  if (/\.?html$/.test(type)) {
    slugs.push(url.resolve(base, file.name));
    if ("index" === file.name) slugs.push(base)
  }

  return slugs;

}



/*

  function readDirectory

*/

Utils.readDirectory = function(p, recursive) {

  var results = [];

  // Set defaults
  if ("undefined" == typeof recursive) recursive = true;
  p = Utils.makePathAbsolute(p);

  // Read in files
  fs.readdirSync(p).forEach(function(file) {

    var stats, parsed;

    // Read file and stats
    file = path.join(p, file);
    stats = fs.lstatSync(file);

    // Recursively walk directory, or add file
    if (stats.isDirectory()) {
      if (recursive)
        results = results.concat(Utils.readDirectory(file, true))
    } else {
      parsed = path.parse(file);
      parsed.path = file;
      results.push(parsed);
    }

  });

  return results;

}
