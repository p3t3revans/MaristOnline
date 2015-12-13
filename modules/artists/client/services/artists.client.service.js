'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('artists').factory('Artists', ['$resource',
  function ($resource) {
    return $resource('api/artists/:artistId', {
      artistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
