
/*

  images.js

  Creates static server handling of image files.

*/

var express = require("express"),
    Utils   = require("./utils"),
    st      = require("st");


module.exports = function(options) {

  // Create path relative to process
  options.path = Utils.makePathAbsolute(options.path);

  // Set up Browsersync
  Utils.watch(options.path, "*");

  return st(options);

}