
/*

  Data.js

*/

var fs         = require("fs"),
    Utils      = require("./utils"),
    jsonServer = require("json-server"),
    assign     = require("lodash.assign");


module.exports = function(options) {

  var results = {};

  // Set defaults
  options = assign({ path : "./data", url : "/" }, options);

  Utils.eachFile(options.path, function(file) {

    var json = JSON.parse(fs.readFileSync(file.path, "utf8")),
        slug = Utils.makeUrls(options.url, { folder : file.folder, name : "" })[0]

    // Create path-like keys using directories (and remove leading "/")
    for (var key in json)
      results[(slug + "/" + key).replace(/^\/+/, "")] = json[key]

  });

  return jsonServer.router(results);

}
