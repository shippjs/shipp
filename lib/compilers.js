
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


function Compiler(options) {
  this.source = options.source;
  this.compile = options.compile;
}


Compiler.prototype.isOk = function() {
  if (!this.source) return true;
  try {
    requires(this.source);
  } catch (err) {
    return false;
  }
  return true;
}



var compilers = {

  "coffee": new Compiler({
    source: "coffee-script",
    compile: function(str, next) {
      next(null, requires("coffee-script").compile(str));
    }
  }),

  "css": new Compiler({
    compile: function(str, next) {
      next(null, raw);
    }
  }),

  "js": new Compiler({
    compile: function(str, next) {
      next(null, raw);
    }
  }),

  "styl": new Compiler({
    source: "stylus",
    compile: function(str, next) {
      requires("stylus").render(str, next);
    }
  }),

  "ts": new Compiler({
    source: "typescript",
    compile: function(str, next) {
      next(null, requires("typescript").transpile(str));
    }
  })

};


module.exports = function(name) {
  return compilers[name];
}


