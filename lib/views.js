
/*

  Views.js

*/

var Utils   = require("./utils"),
    fs      = require("fs"),
    cons    = require("consolidate"),
    assign  = require("lodash.assign"),
    express = require("express");


module.exports = function(options) {

  var router = express();

  // Set defaults
  options = assign({ path : "./views", url : "/" }, options);

  // Add engines
  router.engine("jade", cons.jade);

  // Add HTML engine if not already configured
  if ("undefined" === typeof router.engines["html"]) {
    router.engine("html", function (path, options, fn) {
      fn(null, fs.readFileSync(path, "utf8"));
    });
  }

  // Walk through each file
  Utils.eachFile(options.path, function(file) {

    var handler;

    if (".html" === file.ext)
      handler = function(req, res) { return res.sendFile(file.path); }
    else
      handler = function(req, res) { return res.render(file.path); }

    Utils.makeUrls(options.url, file, ".html").forEach(function(slug) {
      router.get(slug, handler);
    });

  });

  return router;

}
