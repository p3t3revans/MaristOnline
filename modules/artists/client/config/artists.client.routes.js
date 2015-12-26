'use strict';

// Setting up route
angular.module('artists').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('artists', {
        abstract: true,
        url: '/artists',
        template: '<ui-view/>',
        data: {
          roles: ['teach', 'admin','user']
        }
      })
      .state('artists.list', {
        url: '',
        templateUrl: 'modules/artists/views/list-artists.client.view.html'
      })
      .state('artists.create', {
        url: '/create',
        templateUrl: 'modules/artists/views/add-artist.client.view.html'
      })
      .state('artists.view', {
        url: '/:artistId',
        templateUrl: 'modules/artists/views/view-artist.client.view.html'
      })
      .state('artists.edit', {
        url: '/:artistId/edit',
        templateUrl: 'modules/artists/views/edit-artist.client.view.html'
      });
  }
]);
