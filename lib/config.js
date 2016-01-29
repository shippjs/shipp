
/*

  Config.js

*/

var assign = require("lodash/assign"),
    Utils  = require("./utils"),
    fs     = require("fs");


var defaults = {
  fonts: [
    { path : "./fonts",   url : "/fonts",  ext : ["ttf", "otf", "eot", "woff", "svg"] }
  ],
  images: [
    { path : "./images",  url : "/images"  }
  ],
  scripts: [
    { path : "./scripts", url : "/scripts" },
    { path : "./vendor",  url : "/vendor"  }
  ],
  styles: [
    { path : "./styles",  url : "/styles"  }
  ],
  statics: []
};


module.exports = function() {

  // Eventually defaults go here!
  var config = {};

  try {
    config = JSON.parse(fs.readFileSync(Utils.makePathAbsolute("sneakers.json"), "utf8"));
  } catch (err) {}

  // Copy defaults and attach to globals
  config = assign(defaults, config);

  // Store engines
  global.engines = config.engines || {};

  // Store global variables
  global.vars = config.globals || {};
  if (/^prod/.test(process.env.NODE_ENV))
    global.vars = assign(global.vars, config["globals:production"] || {});

  return config;

}
