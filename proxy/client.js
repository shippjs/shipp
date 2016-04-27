/**

  shipp client

**/

var shippSocket = io();
var shippReady = false;

function shippCSS(resource) {
  resource.el.href = resource.url + "?seed=" + new Date().getMilliseconds();
}

function shippJS(resource) {
  var sibling = resource.el.nextSibling,
      parent = resource.el.parentNode,
      s = document.createElement("script");
  s.type = "text/javascript";
  s.src = resource.url;
  parent.removeChild(resource.el);
  parent.insertBefore(s, sibling);
}

function shippImage(resource) {
  resource.el.src = resource.url + "?seed=" + new Date().getMilliseconds();
}

shippSocket.on("route:refresh", function(data) {

  if (!shippReady) return;
  var regex = new RegExp(data.route.replace(/:slug.*$/, ".+"));

  // Check for location refresh
  if (regex.test(window.location.pathname)) return window.location.reload();
  resources = shippGetResourceArray();

  for (var i = 0, n = resources.length; i < n; i++)
    if (regex.test(resources[i].url)) {
      if ("img" === resources[i].el.tagName)
        shippImage(resources[i]);
      else if (/\.css$/.test(resources[i].url))
        shippCSS(resources[i]);
      else if (/\.js$/.test(resources[i].url))
        shippJS(resources[i]);
      else {
        window.location.reload();
        return;
      }
    }
});

function shippGetResourceArray() {
  var resources = [];
  function filter(tag, attr) {
    var tags = Array.prototype.slice.call(document.getElementsByTagName(tag));
    for (var i = 0, n = tags.length; i < n; i++)
      if (/^\/[^\/]/.test(tags[i].getAttribute(attr)))
        resources.push({ el: tags[i], url: tags[i].getAttribute(attr).split("?")[0] });
  }
  filter("link", "href");
  filter("script", "src");
  filter("img", "src");
  return resources;
}

document.addEventListener("DOMContentLoaded", function() { shippReady = true; });
