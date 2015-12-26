'use strict';

// Setting up route
angular.module('subjects').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('subjects', {
        abstract: true,
        url: '/subjects',
        template: '<ui-view/>',
        data: {
          roles: ['teach', 'admin', 'user']
        }
      })
      .state('subjects.list', {
        url: '',
        templateUrl: 'modules/subjects/views/list-subjects.client.view.html'
      })
      .state('subjects.create', {
        url: '/create',
        templateUrl: 'modules/subjects/views/add-subject.client.view.html'
      })
      .state('subjects.view', {
        url: '/:subjectId',
        templateUrl: 'modules/subjects/views/view-subject.client.view.html'
      })
      .state('subjects.edit', {
        url: '/:subjectId/edit',
        templateUrl: 'modules/subjects/views/edit-subject.client.view.html'
      });
  }
]);
