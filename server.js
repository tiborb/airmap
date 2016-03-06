var restify = require('restify');
var sensors = require('./src/sensors');
var server = restify.createServer();

server.get('/', restify.serveStatic({
  directory: './web',
  default: 'index.html'
}));

server.get('sensors', sensors.getSensors);
server.get('heatpoints', sensors.getHeatPoints);

server.get('cluster.js', restify.serveStatic({
  directory: './src'
}));

server.get(/.*\.(js|css|png|gif|ico)/, restify.serveStatic({
  directory: './node_modules'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
