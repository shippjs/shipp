
/*

  Config.js

*/

var assign = require("lodash/assign"),
    Utils  = require("./utils"),
    fs     = require("fs");


module.exports = function() {

  // Eventually defaults go here!
  var defaults = {}, config = {};

  try {
    config = JSON.parse(fs.readFileSync(Utils.makePathAbsolute("config.json"), "utf8"));
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
