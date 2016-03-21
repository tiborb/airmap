angular
  .module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ui-leaflet'])
  .controller('GeoJSONController', ['$scope', '$http', 'leafletMarkerEvents', 'leafletData', function($scope, $http, leafletMarkerEvents, leafletData) {

    angular.extend($scope, {
      stuttgart: {
        lat: 48.74,
        lng: 9.21,
        zoom: 10
      },
      layers: {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz'
          }
        }
      }
    });

    L.GeoJSON = L.GeoJSON.extend({
      addTo: function(map) {
        var self = this;
        map.addLayer(this.markers);
        var parentRemove = L.GeoJSON.prototype.onRemove;
        L.GeoJSON.prototype.onRemove = function(map) {
          self.markers.removeLayer(self);
          delete self.markers;
          parentRemove(map);
        };
        return this;
      }
    });

    L.geoJson = function(geojson, options) {

      var geojsonMarkerOptions = {
        radius: 8,
        //fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      var s = $scope;
      $scope.selectedSensor = '';
      $scope.selectedSensorId = 0;
      function onEachFeature(feature, layer) {
        layer.on('click', function(e) {
          if (feature.properties && feature.properties.name) {
            console.log(feature.properties.name);
            s.toggleRight();
            s.selectedSensor = feature.properties.name;
            s.selectedSensorId = feature.properties.sensor_id;
          }
        });
      }

      var geoJSON = new L.GeoJSON(geojson, {
        style: function(feature) {
            //console.log(feature.properties.avgP2);
            if (feature.properties.avgP1 >= 50000) return {fillColor: '#FF0000'};
            if (feature.properties.avgP1 >= 10000) return {fillColor: '#ff9a00'};
            if (feature.properties.avgP1 >= 1000) return {fillColor: '#fff400'};
            return {fillColor: '#00ff38'};
          },
        pointToLayer: function(feature, latlng) {
          //console.log(feature);
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
      });
      var markers = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 18,
        //iconCreateFunction: function(cluster) {
        //  return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
        //}
      });
      markers.setGeoJSON = function(data) {
        geoJSON.setGeoJSON(data);
      };
      markers.addLayer(geoJSON);
      geoJSON.markers = markers;
      return markers;
    };

    // Get the countries geojson data from a JSON
    $http.get('sensors').success(function(data, status) {
      // cluster
      angular.extend($scope, {
        geojson: {
          data: data
        }
      });

      angular.extend($scope, {
        selected: {
          name: 'None'
        }
      });
    });

    /*
    $http.get('heatpoints').success(function(data) {
      angular.extend($scope, {
        layers: {
          overlays: {
            heat: {
              name: 'Heat Map',
              type: 'heat',
              data: data,
              layerOptions: {
                radius: 40,
                blur: 1,
                gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
              },
              visible: true
            }
          }
        }
    })
  });
  */

  }])
.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
  $scope.filter = {
    pm: "10",
  };
  $scope.applyFilter = function(){
    console.log($scope.filter.pm);
  };
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function() {
    return $mdSidenav('right').isOpen();
  };

  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
        .toggle()
        .then(function() {
          $log.debug('toggle ' + navID + ' is done');
        });
    }, 200);
  }

  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle()
        .then(function() {
          $log.debug('toggle ' + navID + ' is done');
        });
    };
  }
})
.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {

  $scope.selected = {
     name: '',
  };

  $scope.close = function() {
    $mdSidenav('right').close()
      .then(function() {
        $log.debug('close RIGHT is done');
      });
  };
})
;
