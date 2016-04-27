/**

  Proxy server to live refresh assets.

**/

var http = require("http");
var httpProxy = require("http-proxy");


module.exports = function(next) {

  var port = 3000,
      proxy,
      server,
      wrapper;

  // Instantiate proxy
  proxy = httpProxy.createProxyServer({
    target: "http://localhost:" + global.shipp.ports.server
  });

  // Create containing server
  wrapper = global.shipp.framework();
  wrapper.use(proxy.web.bind(proxy));

  server = http.createServer(wrapper);

  // Callback once port has been found
  function portFound() {
    global.shipp.log("Proxy port found. Listening on port", port);
    global.shipp.ports.proxy = port;
    next(null, port);
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
