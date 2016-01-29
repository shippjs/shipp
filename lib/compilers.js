
/*

  Compilers.js

*/


// Require cache
var requires = (function() {
  var cache = {};
  return function(library) {
    return cache[library] || (cache[library] = require(library));
  }
})();


var compilers = module.exports = {

  "coffee": {
    type: "application/javascript",
    compile: function(str, next) {
      next(null, requires("coffee-script").compile(str));
    }
  },

  "css": {
    type: "text/css",
    compile: function(str, next) {
      next(null, raw);
    }
  },

  "js": {
    type: "application/javascript",
    compile: function(str, next) {
      next(null, raw);
    }
  },

  "styl": {
    type: "text/css",
    compile: function(str, next) {
      requires("stylus").render(str, next);
    }
  }

};

