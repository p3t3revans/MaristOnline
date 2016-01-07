'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('pictures').factory('Pictures', ['$resource',
  function ($resource) {
    return $resource('api/pictures/:pictureId', {
      pictureId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

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
