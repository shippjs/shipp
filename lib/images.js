
/*

  images.js

  Creates static server handling of image files.

*/

var express = require("express"),
    Utils   = require("./utils"),
    assign  = require("lodash.assign"),
    st      = require("st");


module.exports = function(options) {

  // Set defaults
  options = assign({ path : "./images", url : "/images" }, options);

  // Create path relative to process
  options.path = Utils.makePathAbsolute(options.path);

  return st(options);

}