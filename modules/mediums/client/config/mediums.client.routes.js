(function () {
    'use strict';
    angular
        .module('mediums.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('mediums', {
            abstract: true,
            url: '/mediums',
            template: '<ui-view/>'
        })
            .state('mediums.list', {
            url: '',
            templateUrl: 'modules/mediums/client/views/list-mediums.client.view.html',
            controller: 'MediumsListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Mediums List'
            }
        })
            .state('mediums.create', {
            url: '/create',
            templateUrl: 'modules/mediums/client/views/form-medium.client.view.html',
            controller: 'MediumsController',
            controllerAs: 'vm',
            resolve: {
                mediumResolve: newMedium
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Mediums Create'
            }
        })
            .state('mediums.edit', {
            url: '/:mediumId/edit',
            templateUrl: 'modules/mediums/client/views/form-medium.client.view.html',
            controller: 'MediumsController',
            controllerAs: 'vm',
            resolve: {
                mediumResolve: getMedium
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Medium {{ mediumResolve.title }}'
            }
        })
            .state('mediums.view', {
            url: '/:mediumId',
            templateUrl: 'modules/mediums/client/views/view-medium.client.view.html',
            controller: 'MediumsController',
            controllerAs: 'vm',
            resolve: {
                mediumResolve: getMedium
            },
            data: {
                pageTitle: 'Medium {{ mediumResolve.title }}'
            }
        });
    }
    getMedium.$inject = ['$stateParams', 'MediumsService'];
    function getMedium($stateParams, MediumsService) {
        return MediumsService.get({
            mediumId: $stateParams.mediumId
        }).$promise;
    }
    newMedium.$inject = ['MediumsService'];
    function newMedium(MediumsService) {
        return new MediumsService();
    }
}());
