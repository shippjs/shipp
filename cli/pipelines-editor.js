/**

  pipelines-editor.js

**/


//
//  Dependencies
//

var chalk = require("chalk"),
    utils = require("./cli-utils");



//
//  Exports
//

module.exports = {

  /**

    Writes a list of available pipelines to server.

  **/

  list: function() {

    var editor = require("./config-editor"),
        pipelines = editor.get("pipelines"),
        columns = [];

    // Add in defaults for HTML, CSS and JS
    ["html", "css", "js"].forEach(function(key) {
      if (!pipelines[key]) pipelines[key] = key;
    });

    // Add to columns
    for (var key in pipelines)
      columns.push(["*." + key, pipelines[key]]);

    utils.showGrid(columns, {
      title   : "Pipelines:",
      len     : 20,
      headers : ["Extension", "Pipeline"]
    });

  },



  /**

    Adds a pipeline to the config file and acknowledges with confirmation.

    @param {String} ext The extension to associate with the pipeline
    @param {String} pipeline The pipeline (e.g. "jade>handlebars")

  **/

  add: function(ext, pipeline) {

    ext = ext.replace(/^[\*\.]*/, "");

    var editor = require("./config-editor"),
        key    = "pipelines." + ext,
        prev   = editor.get(key);

    function suffix(val) {
      return chalk.yellow("*." + ext) + " files with " + chalk.yellow(val);
    }

    console.log("");

    if (prev === pipeline) {
      console.log("   " + chalk.red("No Change:") + " leadship was already processing " + suffix(pipeline));
    } else {
      editor.set(key, pipeline);
      editor.save();
      if (prev && prev !== pipeline) console.log("   " + chalk.cyan("Removed:") + " leadship will no longer process " + suffix(prev));
      console.log("   " + chalk.cyan("Added:") + " leadship will process " + suffix(editor.get(key)));
    }

    console.log("");

  },


  /**

    Removes a pipeline from the config file and acknowledges with confirmation.

    @param {String} ext The extension of the pipeline to remove

  **/

  remove: function(ext) {

    ext = ext.replace(/^[\*\.]*/, "");

    var editor = require("./config-editor"),
        key    = "pipelines." + ext,
        prev   = editor.get(key);

    console.log("");

    if (!prev) {
      if (["html", "css", "js"].indexOf(ext) > -1)
        console.log("   " + chalk.red("Error:") + " you can't remove the pipeline for " + chalk.yellow("*." + ext) + " files (it's static!)");
      else
        console.log("   " + chalk.red("No Change:") + " there was no pipeline associated with " + chalk.yellow("*." + ext) + " files ");
    } else {
      editor.unset("pipelines." + ext);
      editor.save();
      console.log("   " + chalk.cyan("Removed:") + " leadship will no longer process " + chalk.yellow("*." + ext) + " files with " + chalk.yellow(prev));
    }

    console.log("");

  }

};
