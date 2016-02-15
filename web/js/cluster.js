var app = angular.module('demoapp', ['ui-leaflet']);
app.controller('GeoJSONController', ['$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
  angular.extend($scope, {
    stuttgart: {
      lat: 48.74,
      lng: 9.21,
      zoom: 10
    },
    defaults: {
      scrollWheelZoom: true
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

  var markerClick = function(leafletObject, leafletPayload, model) {
    console.log(model.properties.name);
  };

  $scope.$on('leafletDirectiveGeoJson.click', function(ev, leafletPayload) {
    markerClick(leafletPayload.leafletObject, leafletPayload.leafletEvent, leafletPayload.model);
  });

  // Get the countries geojson data from a JSON
  $http.get('json/dustipos.json').success(function(data, status) {
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
}]);
