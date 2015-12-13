'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('subjects').factory('Subjects', ['$resource',
  function ($resource) {
    return $resource('api/subjects/:subjectId', {
      subjectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
