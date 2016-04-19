(function () {
    'use strict';
    angular
        .module('years.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('years', {
            abstract: true,
            url: '/years',
            template: '<ui-view/>'
        })
            .state('years.list', {
            url: '',
            templateUrl: 'modules/years/client/views/list-years.client.view.html',
            controller: 'YearsListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Years List'
            }
        })
            .state('years.create', {
            url: '/create',
            templateUrl: 'modules/years/client/views/form-year.client.view.html',
            controller: 'YearsController',
            controllerAs: 'vm',
            resolve: {
                yearResolve: newYear
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Years Create'
            }
        })
            .state('years.edit', {
            url: '/:yearId/edit',
            templateUrl: 'modules/years/client/views/form-year.client.view.html',
            controller: 'YearsController',
            controllerAs: 'vm',
            resolve: {
                yearResolve: getYear
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Year {{ yearResolve.year }}'
            }
        })
            .state('years.view', {
            url: '/:yearId',
            templateUrl: 'modules/years/client/views/view-year.client.view.html',
            controller: 'YearsController',
            controllerAs: 'vm',
            resolve: {
                yearResolve: getYear
            },
            data: {
                pageTitle: 'Year {{ yearResolve.year }}'
            }
        });
    }
    getYear.$inject = ['$stateParams', 'YearsService'];
    function getYear($stateParams, YearsService) {
        return YearsService.get({
            yearId: $stateParams.yearId
        }).$promise;
    }
    newYear.$inject = ['YearsService'];
    function newYear(YearsService) {
        return new YearsService();
    }
}());
