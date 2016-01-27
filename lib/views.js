
/*

  Views.js

*/

var Utils    = require("./utils"),
    Metadata = require("./metadata"),
    fs       = require("fs"),
    cons     = require("consolidate"),
    assign   = require("lodash/assign"),
    constant = require("lodash/constant"),
    express  = require("express");


module.exports = function(db, options) {

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

    var handler,
        getData,
        metadata = Metadata.extract(Utils.readFileHead(file.path, 500));

    if (metadata.data)
      getData = function() { return db.queries(metadata.data); }
    else
      getData = constant({});

    handler = function(req, res) {
      router.render(file.path, getData() || {}, function(err, html) {
        res.type("text/html").send(html);
      });
    }

    Utils.makeUrls(options.url, file, ".html").forEach(function(slug) {
      router.get(slug, handler);
    });

  });

  return router;

}
