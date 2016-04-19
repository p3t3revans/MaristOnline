(function () {
    'use strict';
    angular
        .module('pictures.routes')
        .config(routeConfig);
    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('pictures', {
            abstract: true,
            url: '/pictures',
            template: '<ui-view/>'
        })
            .state('pictures.list', {
            url: '',
            templateUrl: 'modules/pictures/client/views/list-pictures.client.view.html',
            controller: 'PicturesListController',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Pictures List'
            }
        })
            .state('pictures.create', {
            url: '/create',
            templateUrl: 'modules/pictures/client/views/form-picture.client.view.html',
            controller: 'PicturesController',
            controllerAs: 'vm',
            resolve: {
                pictureResolve: newPicture
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Pictures Create'
            }
        })
            .state('pictures.edit', {
            url: '/:pictureId/edit',
            templateUrl: 'modules/pictures/client/views/form-picture.client.view.html',
            controller: 'PicturesController',
            controllerAs: 'vm',
            resolve: {
                pictureResolve: getPicture
            },
            data: {
                roles: ['user', 'admin'],
                pageTitle: 'Edit Picture {{ pictureResolve.title }}'
            }
        })
            .state('pictures.view', {
            url: '/:pictureId',
            templateUrl: 'modules/pictures/client/views/view-picture.client.view.html',
            controller: 'PicturesController',
            controllerAs: 'vm',
            resolve: {
                pictureResolve: getPicture
            },
            data: {
                pageTitle: 'Picture {{ pictureResolve.title }}'
            }
        });
    }
    getPicture.$inject = ['$stateParams', 'PicturesService'];
    function getPicture($stateParams, PicturesService) {
        return PicturesService.get({
            pictureId: $stateParams.pictureId
        }).$promise;
    }
    newPicture.$inject = ['PicturesService'];
    function newPicture(PicturesService) {
        return new PicturesService();
    }
}());
