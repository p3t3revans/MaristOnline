'use strict';

// Setting up route
angular.module('teachers').config(['$stateProvider',
  function ($stateProvider) {
    // Teachers state routing
    $stateProvider
      .state('teachers', {
        abstract: true,
        url: '/teachers',
        template: '<ui-view/>',
        data: {
          roles: ['teach', 'admin','user']
        }
      })
      .state('teachers.list', {
        url: '',
        templateUrl: 'modules/teachers/views/list-teachers.client.view.html'
      })
      .state('teachers.create', {
        url: '/create',
        templateUrl: 'modules/teachers/views/create-teacher.client.view.html'
      })
      .state('teachers.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/views/view-teacher.client.view.html'
      })
      .state('teachers.edit', {
        url: '/:teacherId/edit',
        templateUrl: 'modules/teachers/views/edit-teacher.client.view.html'
      });
  }
]);
