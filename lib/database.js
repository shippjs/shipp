
/*

  Database.js

*/

var fs         = require("fs"),
    low        = require("lowdb"),
    Utils      = require("./utils"),
    assign     = require("lodash.assign");
/*

  function extendDatabase

  Adds a "get" function so that lowdb can handle key/values.

*/

function extendDatabase(db) {

  db.get = function(key) {

    var val = db.object[key];

    // Handle deep queries?
    if (Array.isArray(val))
      return db(key);
    else
      return _(val);

  }

  return db;

}


module.exports = function(options) {

  var db = low(),
      results = {};

  // Set defaults
  options = assign({ path : "./data", url : "/" }, options);

  Utils.eachFile(options.path, function(file) {

    var json = JSON.parse(fs.readFileSync(file.path, "utf8")),
        slug = Utils.makeUrls(options.url, { folder : file.folder, name : "" })[0]

    // Create path-like keys using directories (and remove leading "/")
    for (var key in json)
      results[(slug + "/" + key).replace(/^\/+/, "")] = json[key]

  });

  db.source = results;
  return db;

}
