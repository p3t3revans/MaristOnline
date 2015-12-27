'use strict';

//Mediums service used for communicating with the mediums REST endpoints
angular.module('mediums').factory('Mediums', ['$resource',
  function ($resource) {
    return $resource('api/mediums/:mediumId', {
      mediumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
