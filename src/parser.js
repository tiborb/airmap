var csv = require('fast-csv');
var fs = require('fs');
var walk = require('walk');

var geoJson = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
    }
  },
  'features': []
};

function addToGeoJson(data) {
  geoJson.features.push({
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [data.lon, data.lat]
    },
    'properties': {
      'name': '????',
      'avgP1': data.avgP1,
      'avgP2': data.avgP2
    }
  });
  //console.log(data);
  console.log(JSON.stringify(geoJson));
  fs.writeFile('json/sensors.json', JSON.stringify(geoJson), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
}

function processFile(path, cb) {
  var sen = {};
  var sumP2 = 0;
  var sumP1 = 0;
  var counter = 0;
  var stream = fs.createReadStream(path);

  var csvStream = csv
    .parse({
      headers: true,
      delimiter: ';'
    })
    .on('data', function(data) {
      sen.id = parseInt(data.sensor_id);
      sen.lat = (data.lat != "") ? parseFloat(data.lat) : 0;
      sen.lon = (data.lon != "") ? parseFloat(data.lon) : 0;
      sumP2 += parseFloat(data.P2);
      sumP1 += parseFloat(data.P1);
      counter ++;
    })
    .on('end', function() {
      sen.avgP1 = sumP1 / counter;
      sen.avgP2 = sumP2 / counter;
      //console.log("sumP2 " + sumP2 + "\n");
      //console.log("sumP1 " + sumP1 + "\n");
      //console.log(sen);
      cb(sen);
    });
  stream.pipe(csvStream);
}

function processDir(dir, cb) {

  walker = walk.walk(dir, {
    followLinks: false
    , filters: []
  });

  walker.on('file', function(root, fileStats, next) {
    if (fileStats.name.match(/csv/)) {
      processFile(dir + '/' + fileStats.name, cb);
    }
    next();
  });

  walker.on('errors', function(root, nodeStatsArray, next) {
    next();
  });

  walker.on('end', function() {
    console.log('all done');
  });
}
processDir('csv', addToGeoJson);
//processFile('csv/2016-03-14_ppd42ns_sensor_34.csv');
