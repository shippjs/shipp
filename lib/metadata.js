
/*

  Metadata.js

  Metadata is stored as comments near the beginning of an HTML file.
  e.g. DATA=recipes:/api/recipes{slug,url}?recipe.key=<slug>,/users

*/

var Utils    = require("./utils"),
    Metadata = {};


module.exports = Metadata;


/*

  function extract

  Extracts pertinent metadata for querying.

*/

Metadata.extract = function(str) {

  var names = ["QUERY", "DATA"],
      re    = new RegExp("(\\b(?:" + names.join("|") + ")\\=[^\\s\\n\\r]+)", "g"),
      meta  = {};

  Utils.getRegExpMatches(str, re).map(Metadata.parse).forEach(function(metadata) {
    meta[metadata["name"].toLowerCase()] = metadata.queries;
  });

  return meta;

}



/*

  function parse

  Converts command into multiple querys
  e.g. DATA=<query1>,<query2>

*/

Metadata.parse = function(str) {

  var re = /([^\{,]*\{[^\}]*\}[^,]*|[^\{\},]+),*/g,
      matches = str.split(/\=(.*)/);

  return {
    name    : matches[0],
    queries : Utils.getRegExpMatches(matches[1], re).map(Metadata.parseQuery)
  }

}



/*

  function parseQuery

  Parses a specific metadata query.

*/

Metadata.parseQuery = function(str) {

  var query = {},
      parts = /^(?:([^:]+):)?([^\{?]+)(?:\{([^\}]+)\})?(?:\?(.*))?$/g.exec(str);

  if (parts) {
    if (parts[1]) query.key     = parts[1];
    if (parts[2]) query.route   = parts[2].replace(/^\//, "");
    if (parts[4]) query.filters = parts[4];
    if (parts[3]) query.picks   = parts[3].split(",");
  }

  return query;

}

