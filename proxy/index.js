/**

  Proxy server to live refresh assets.

**/

var fs = require("fs"),
    http = require("http"),
    path = require("path"),
    socketio = require("socket.io"),
    httpProxy = require("http-proxy");


/**

  Load and cache the client scripts.

**/

var getScript = (function() {
  var scripts = {};
  return function(filename, next) {
    next = next || function() {};
    if (scripts[filename]) return next(null, scripts[filename]);
    fs.readFile(path.join(__dirname, filename), "utf8", function(err, file) {
      if (err) return next(err);
      scripts[filename] = file;
      next(null, scripts[filename]);
    });
  }
})();

getScript("client.js");
getScript("socket.io.min.js");


/**

  Instantiates a proxy server

**/

module.exports = function(next) {

  var port = 3000,
      io,
      proxy,
      server,
      wrapper;

  // Instantiate proxy
  proxy = httpProxy.createProxyServer({
    target: "http://localhost:" + global.shipp.ports.server
  });

  // Create containing server
  wrapper = global.shipp.framework();

  wrapper.get("/shipp-browser-client.js", function(req, res) {
    getScript("client.js", function(err, script) {
      if (err) return res.status(500).end();
      res.type("text/javascript").send(script);
    });
  });

  wrapper.get("/shipp-socket.io.min.js", function(req, res) {
    getScript("socket.io.min.js", function(err, script) {
      if (err) return res.status(500).end();
      res.type("text/javascript").send(script);
    });
  });

  wrapper.use(require("./rewriter"));
  wrapper.use(proxy.web.bind(proxy));

  server = http.createServer(wrapper);

  // Watch for file refreshes
  io = socketio(server);
  global.shipp.on("route:refresh", function(data) {
    // Convert to regex
    if (data.route instanceof RegExp)
      data.route = data.route.toString().slice(1, -1);
    else
      data.route = "^" + data.route.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(":slug", ".+") + "$";
    io.emit("route:refresh", data);
  });

  // Callback once port has been found
  function portFound() {
    global.shipp.log("Proxy port found. Listening on port", port);
    global.shipp.ports.proxy = port;
    next(null, server);
  }

  // Recursive function to find port
  global.shipp.debug("Finding proxy port, starting at port", port);
  (function findPort(retries) {

    if (retries <= 0) return next(new Error("Could not find open port"));

    server
    .listen(port)
    .on("listening", portFound)
    .on("error", function(err) {
      port++;
      findPort(--retries);
    });

  })(10);

};
