
/*

  Views.js

*/

var Utils    = require("./utils"),
    Metadata = require("./metadata"),
    fs       = require("fs"),
    cons     = require("consolidate"),
    assign   = require("lodash/assign"),
    constant = require("lodash/constant"),
    express  = require("express"),
    Promise  = require("bluebird"),
    readFile = Promise.promisify(fs.readFile);


function addEngines(router, engines) {
  for (var ext in engines)
    router.engine(ext, makeEngine(engines[ext]));

  // Add standard html engine if not already added
  if (!router.engines["html"]) router.engine("html", makeEngine("html"));
}


function makeEngine(pipeline) {

  // Simple temlating
  if (-1 === pipeline.indexOf(">") && "html" !== pipeline) return cons[pipeline];

  return function(path, options, fn) {

    var promise = readFile(path, "utf8"),
        engines = (pipeline) ? pipeline.split(">") : [],
        engine;

    // Chain through engines
    while (engine = engines.shift())
      if ("html" !== engine) (function(eng) {
        promise = promise.then(function(str) { return cons[eng].render(str, options); })
      })(engine);

    // Return result
    promise.then(function(str) { fn(null, str ); });

  };
}


function addHtmlEngine(router) {
  if ("undefined" === typeof router.engines["html"]) {
    router.engine("html", function (path, options, fn) {
      fn(null, fs.readFileSync(path, "utf8"));
    });
  }
}


function makeDataQuery(db, query) {
  if (query)
    return function() { return db.queries(query); }
  else
    return constant({});
}


function makeRoutes(route, file, query) {
  return Utils.makeUrls(route, file, ".html");
}


module.exports = function(db, options) {

  var router = express();

  // Set defaults
  options = assign({ path : "./views", url : "/" }, { engines : global.engines }, options);
  addEngines(router, options.engines);

  // Walk through each file
  Utils.eachFile(options.path, function(file) {

    var metadata  = Metadata.extract(Utils.readFileHead(file.path, 500)),
        dataQuery = makeDataQuery(db, metadata.data),
        handler;

    handler = function(req, res) {

      router.render(file.path, dataQuery() || {}, function(err, html) {

        // Set cookies
        for (var key in metadata.cookies || {})
          res.cookie(key, metadata.cookies[key]);

        // Set session
        for (var key in metadata.session || {})
          req.session[key] = metadata.session[key];

        // Send response
        res.type("text/html").send(html);

      });
    }

    makeRoutes(options.url, file, metadata.query).forEach(function(slug) {
      router.get(slug, handler);
    });

  });

  return router;

}
