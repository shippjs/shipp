
/*

  Compiled.js

*/

var Utils     = require("./utils"),
    fs        = require("fs"),
    compilers = require("./compilers"),
    express   = require("express");


module.exports = function(options) {

  var router = express(),
      exts = [];

  // Walk through each file
  Utils.eachFile(options.path, function(file) {

    var ext = file.ext.replace(/^\./, ""),
        compiler = compilers(ext);

    // Error message
    if (!compiler || !compiler.isOk()) console.log("Warning: Package missing to compile", ext, "files. Make sure to `npm install` it.");

    // Add to list of extensions if not present
    if (-1 === exts.indexOf(ext)) exts.push(ext);

    router.get(Utils.makeUrls(options.url, file, options.ext)[0], function(req, res) {
      compiler.compile(fs.readFileSync(file.path, "utf8"), function(err, compiled) {
        return res.type((options.ext) === "js" ? "application/javascript" : "text/css").send(compiled);
      });
    });

  });

  // Set up Browsersync
  Object.keys(exts).forEach(function(ext) {
    Utils.watch(options.path, ext, options.ext);
  });

  return router;

}
