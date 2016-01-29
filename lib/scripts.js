
/*

  Scripts.js

*/

var Utils        = require("./utils"),
    fs           = require("fs"),
    express      = require("express"),
    Coffeescript = require("coffee-script");


var preprocessors = {
  ".js"     : function(raw, next) { next(raw); return; },
  ".coffee" : function(raw, next) { next(Coffeescript.compile(raw)); return }
}


module.exports = function(options) {

  var router = express();

  // Set up Browsersync
  Object.keys(preprocessors).forEach(function(ext) { Utils.watch(options.path, ext, "js"); });

  // Walk through each file
  Utils.eachFile(options.path, { filter : Object.keys(preprocessors) }, function(file) {

    router.get(Utils.makeUrls(options.url, file, ".js")[0], function(req, res) {
      preprocessors[file.ext](fs.readFileSync(file.path, "utf8"), function(formatted) {
        return res.type("application/javascript").send(formatted);
      });
    });

  });

  return router;

}
