(function () {
  'use strict';

  angular
    .module('pictures.services')
    .factory('PicturesService', PicturesService);

  PicturesService.$inject = ['$resource'];

  function PicturesService($resource) {
    return $resource('api/pictures/:pictureId', {
      pictureId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

//Articles service used for communicating with the articles REST endpoints
angular.module('pictures').factory('PicturesPage', ['$resource',
    function ($resource) {
        return $resource('api/picturespage/:page', {
            page: '@page'
        }
            );
    }
]);

//Articles service used for communicating with the articles REST endpoints
angular.module('pictures').factory('PicturesFrontPage', ['$resource',
    function ($resource) {
        return $resource('api/picturesfrontpage/:page', {
            page: '@page'
        }
            );
    }
]);

//Pictures by Artist REST endpoints
angular.module('pictures').factory('PicturesByArtist', ['$resource',
    function ($resource) {
        return $resource('api/picturesbyartist/:artistId/page/:page/count/:count', {
            artist: '@artistId', page: '@page'
        }
            );
    }
]);

//Pictures by Year REST endpoints
angular.module('pictures').factory('PicturesByYear', ['$resource',
    function ($resource) {
        return $resource('api/picturesbyyear/:year/page/:page/count/:count', {
            artist: '@year', page: '@page', count: '@count'
        }
            );
    }
]);
