/**

  Injects shipp script

**/

var stream = require("stream"),
    zlib = require("zlib");


module.exports = function(req, res, next) {

  var isHTML,
      transform,
      head,
      tail,
      added = false,
      re = /<\/html>/i,
      script = "<script src='/shipp-socket.io.min.js'></script><script src='/shipp-browser-client.js'></script>",
      end = res.end,
      write = res.write,
      writeHead = res.writeHead;

  res.writeHead = function() {

    isHTML = /^text\/html/i.test(this.get("Content-Type"));

    if (isHTML) {

      // Headers will change
      res.removeHeader("Content-Length");

      // Create transformation stream
      transform = stream.Transform({
        transform: function(chunk, enc, next) {
          var str = chunk.toString();
          if (re.test(str)) {
            this.push(new Buffer(str.replace(re, script + "</html>")));
            added = true;
          } else
            this.push(chunk);
          next();
        },
        flush: function(next) {
          if (!added) this.push(script);
          next();
        }
      });

      // Pipeline depends on encoding. When unzipped, req > transform > res
      // If zipped: req > unzip > transform > zip > res
      encoding = this.get("Content-Encoding");

      if (encoding === "gzip") {
        head = zlib.createGunzip();
        tail = head.pipe(transform).pipe(zlib.createGzip());
      } else if (encoding === "deflate") {
        head = zlib.createDeflate();
        tail = head.pipe(transform).pipe(zlib.createGzip());
      } else {
        head = transform;
        tail = transform;
      }

      tail.on("data", function(data) { write.call(res, data); });
      tail.on("end", function() { end.call(res); });

    }

    writeHead.apply(res, Array.prototype.slice.call(arguments));

  };

  res.write = function(data) {
    if (!isHTML) return write.apply(res, arguments);
    head.write(data);
  };

  res.end = function(data) {
    if (!isHTML) return end.apply(res, arguments);
    if (data) head.write(data);
    head.end();
  };

  next();

};
