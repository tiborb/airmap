angular
  .module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ui-leaflet', 'chart.js'])
  .controller('GeoJSONController', ['$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

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
      var geoJSON = new L.GeoJSON(geojson, options);
      var markers = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 18
      });
      markers.setGeoJSON = function(data) {
        geoJSON.setGeoJSON(data);
      };
      markers.addLayer(geoJSON);
      geoJSON.markers = markers;
      return markers;
    };

    var markerClick = function($scope, leafletObject, leafletPayload, model) {
      //$scope.toggleRight();
      console.log(model.properties.name);
    };

    $scope.$on('leafletDirectiveGeoJson.click', function(ev, leafletPayload) {
      markerClick($scope, leafletPayload.leafletObject, leafletPayload.leafletEvent, leafletPayload.model);
    });

    // Get the countries geojson data from a JSON
    $http.get('json/dustipos.json').success(function(data, status) {
      // cluster
      angular.extend($scope, {
        geojson: {
          data: data,
          style: {
            fillColor: 'green',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          }
        }
      });
    });

    $http.get('json/heat-points.json').success(function(data) {
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
})
.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
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
