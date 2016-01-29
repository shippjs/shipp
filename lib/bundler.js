
/*

  Bundler.js

*/

var utils    = require("./utils"),
    path     = require("path"),
    webpack  = require("webpack");


function Bundler(options) {

  // Configure
  this.config = {
    entry: options.entry,
    output: {
      path: options.path || "/apps/",
      filename: options.filename,
    }
  };

  // Store path
  this.path = path.join(this.config.output.path, options.filename);

  // Set up bundler
  this.bundler = webpack(this.config);
  this.bundler.outputFileSystem = global.fs;

  return this;

}


Bundler.prototype.compile = function(next) {
  this.bundler.run(next);
  return this;
}


Bundler.prototype.get = function() {
  return global.fs.readFileSync(this.path, "utf8");
}


module.exports = Bundler;
