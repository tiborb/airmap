var restify = require('restify');
var server = restify.createServer();

server.get('.*', restify.serveStatic({
  directory: './web',
  default: 'index.html'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
