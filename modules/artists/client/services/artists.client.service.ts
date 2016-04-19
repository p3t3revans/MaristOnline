(function () {
  'use strict';

  angular
    .module('artists.services')
    .factory('ArtistsService', ArtistsService);

  ArtistsService.$inject = ['$resource'];

  function ArtistsService($resource) {
    return $resource('api/artists/:artistId', {
      artistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

angular.module('artists').factory('ArtistYearEnrolled', ['$resource',
  function ($resource) {
    return $resource('api/artistsyearenrolled/:yearEnrolled', {
      yearEnrolled: '@yearEnrolled'
    });
  }
]);
