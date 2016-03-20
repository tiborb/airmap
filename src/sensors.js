var fs = require('fs');

module.exports = {
  getSensors: function(req, res, next){
    // read real data here
    fs.readFile('./json/sensors.json', 'utf8', function(err, data){
      if (err) throw err;
      var d = JSON.parse(data);
      console.log(d);
      res.send(200, d);
    });
    next();
  },

  getHeatPoints: function (req, res, next){
    // read real data here
    fs.readFile('./json/heat-points.json', 'utf8', function(err, data){
      if (err) throw err;
      var d = JSON.parse(data);
      res.send(200, d);
    });
    next();
  }
}
