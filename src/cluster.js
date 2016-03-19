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
      $scope.selectedSensor = "Nothing ...";
      function onEachFeature(feature, layer) {
        layer.on('click', function(e){
          if (feature.properties && feature.properties.name) {
              console.log(feature.properties.name);
              s.toggleRight();
              s.selectedSensor = feature.properties.name;
          }
        });
      }

      var geoJSON = new L.GeoJSON(geojson, {
        style: function(feature) {
            if (feature.properties.avg >= 1000) return {fillColor: "#FF0000"};
            if (feature.properties.avg >= 500) return {fillColor: "#ff9a00"};
            if (feature.properties.avg >= 100) return {fillColor: "#fff400"};
            return {fillColor: "#00ff38"}
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
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function() {
    return $mdSidenav('right').isOpen();
  };

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
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

  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
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
.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function() {
    $mdSidenav('left').close()
      .then(function() {
        $log.debug('close LEFT is done');
      });

  };

  $scope.data = {
     pm10: true,
     pm25: true
   };
  $scope.onChange = function(cbState) {
     $scope.message = cbState;
   };
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
/*
.controller("LineCtrl", function ($scope) {

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };MyApp
});
*/
;
