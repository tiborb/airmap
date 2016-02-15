var app = angular.module("demoapp", ["ui-leaflet"]);
app.controller("GeoJSONController", [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
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
  // Get the countries geojson data from a JSON
  $http.get("json/dustipos.json").success(function(data, status) {
      angular.extend($scope, {
          geojson: {
              data: data,
              style: {
                  fillColor: "green",
                  weight: 2,
                  opacity: 1,
                  color: 'white',
                  dashArray: '3',
                  fillOpacity: 0.7
              }
          }
      });
  });
} ]);
