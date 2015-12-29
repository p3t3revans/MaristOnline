'use strict';

//Years service used for communicating with the years REST endpoints
angular.module('years').factory('Years', ['$resource',
  function ($resource) {
    return $resource('api/years/:yearId', {
      yearId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
