'use strict';

// Setting up route
angular.module('years').config(['$stateProvider',
  function ($stateProvider) {
    // Years state routing
    $stateProvider
      .state('years', {
        abstract: true,
        url: '/years',
        template: '<ui-view/>',
        data: {
          roles: ['teach', 'admin','user']
        }
      })
      .state('years.list', {
        url: '',
        templateUrl: 'modules/years/views/list-years.client.view.html'
      })
      .state('years.create', {
        url: '/create',
        templateUrl: 'modules/years/views/create-year.client.view.html'
      })
      .state('years.view', {
        url: '/:yearId',
        templateUrl: 'modules/years/views/view-year.client.view.html'
      })
      .state('years.edit', {
        url: '/:yearId/edit',
        templateUrl: 'modules/years/views/edit-year.client.view.html'
      });
  }
]);
