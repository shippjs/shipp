
/*

  API.js

*/

var assign     = require("lodash.assign"),
    jsonServer = require("json-server");


module.exports = function(db, options) {

  // Set defaults
  options = assign({}, options);

  return jsonServer.router(db.source);

}
