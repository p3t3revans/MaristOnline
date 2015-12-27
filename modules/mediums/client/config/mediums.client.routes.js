'use strict';

// Setting up route
angular.module('mediums').config(['$stateProvider',
  function ($stateProvider) {
    // Mediums state routing
    $stateProvider
      .state('mediums', {
        abstract: true,
        url: '/mediums',
        template: '<ui-view/>',
        data: {
          roles: ['teach', 'admin','user']
        }
      })
      .state('mediums.list', {
        url: '',
        templateUrl: 'modules/mediums/views/list-mediums.client.view.html'
      })
      .state('mediums.create', {
        url: '/create',
        templateUrl: 'modules/mediums/views/create-medium.client.view.html'
      })
      .state('mediums.view', {
        url: '/:mediumId',
        templateUrl: 'modules/mediums/views/view-medium.client.view.html'
      })
      .state('mediums.edit', {
        url: '/:mediumId/edit',
        templateUrl: 'modules/mediums/views/edit-medium.client.view.html'
      });
  }
]);
