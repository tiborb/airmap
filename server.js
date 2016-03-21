var restify = require('restify');
var sensors = require('./src/sensors');
var server = restify.createServer();

server.get('/', restify.serveStatic({
  directory: './web',
  default: 'index.html'
}));

server.get('sensors', sensors.getSensors);
server.get('heatpoints', sensors.getHeatPoints);

server.get(/(bower_components.*|\.js)/, restify.serveStatic({
  directory: './web'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
