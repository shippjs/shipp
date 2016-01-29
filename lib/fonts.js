
/*

  fonts.js

  Creates static server handling of image files.

*/

var express = require("express"),
    Utils   = require("./utils"),
    assign  = require("lodash/assign"),
    st      = require("st");


module.exports = function(options) {

  // Set defaults
  options = assign({ path : "./fonts", url : "/fonts" }, options);

  // Create path relative to process
  options.path = Utils.makePathAbsolute(options.path);

  // Set up Browsersync
  ["ttf", "otf", "eot", "woff", "svg"].forEach(function(ext) {
    Utils.watch(options.path, ext);
  });

  return st(options);

}