
/*

  Database.js

*/

var fs    = require("fs"),
    low   = require("lowdb"),
    Utils = require("./utils"),
    _     = require("lodash/core");


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

  var db = extendDatabase(low()),
      val;

  // Set defaults
  options = _.extend({ path : "./data", url : "/" }, options);

  Utils.eachFile(options.path, function(file) {

    var json = JSON.parse(fs.readFileSync(file.path, "utf8")),
        slug = Utils.makeUrls(options.url, { folder : file.folder, name : "" })[0]

    // Create path-like keys using directories (and remove leading "/")
    for (key in json) {

      // Remove leading "/" and make db key-friendly
      val = json[key];
      key = (slug + "/" + key).replace(/\/+/g, "/").replace(/^\/+/, "")
      db.object[key] = val;

    }

  });

  return db;

}
