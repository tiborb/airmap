var restify = require('restify');
var server = restify.createServer();

server.get('/', restify.serveStatic({
  directory: './web',
  default: 'index.html'
}));

server.get(/.*\.json/, restify.serveStatic({
  directory: './json'
}));

server.get('cluster.js', restify.serveStatic({
  directory: './src'
}));

server.get(/.*\.(js|css|png|gif|ico)/, restify.serveStatic({
  directory: './node_modules'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
