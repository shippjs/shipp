
/*

  Styles.js

*/

var Utils   = require("./utils"),
    fs      = require("fs"),
    assign  = require("lodash/assign"),
    express = require("express"),
    stylus  = require("stylus");


var preprocessors = {
  ".css"  : function(raw, next) { next(raw); return; },
  ".styl" : function(raw, next) { stylus.render(raw, function(err, formatted) { next(formatted); }) }
}


module.exports = function(options) {

  var router = express(),

  // Set defaults
  options = assign({ path : "./styles", url : "/styles" }, options);

  // Set up Browsersync
  Object.keys(preprocessors).forEach(function(ext) { Utils.watch(options.path, ext, "css"); });

  // Walk through each file
  Utils.eachFile(options.path, function(file) {

    router.get(Utils.makeUrls(options.url, file, "css")[0], function(req, res) {
      preprocessors[file.ext](fs.readFileSync(file.path, "utf8"), function(formatted) {
        return res.type("text/css").send(formatted);
      });
    });

  });

  return router;

}
