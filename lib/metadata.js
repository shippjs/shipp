
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
    if (parts[3]) query.fields  = parts[3].split(",");
    if (parts[4]) query.filters = Metadata.parseFilters(parts[4]);
  }

  return query;

}


/*

  function parseFilters

*/

Metadata.parseFilters = function(str) {

  var results = {},
      parts;

  str.split("&").forEach(function(filter) {
    parts = filter.split("=");
    results[parts[0]] = parts[1];
  });

  return results;

}

