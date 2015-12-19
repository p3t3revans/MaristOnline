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

angular.module('artists').factory('ArtistYearEnrolled', ['$resource',
  function ($resource) {
    return $resource('api/artistsyearenrolled/:yearEnrolled', {
      yearEnrolled: '@yearEnrolled'
    });
  }
]);
