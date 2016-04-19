(function () {
  'use strict';

  angular
    .module('mediums.services')
    .factory('MediumsService', MediumsService);

  MediumsService.$inject = ['$resource'];

  function MediumsService($resource) {
    return $resource('api/mediums/:mediumId', {
      mediumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
