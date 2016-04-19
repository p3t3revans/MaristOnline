(function () {
    'use strict';
    angular
        .module('years.services')
        .factory('YearsService', YearsService);
    YearsService.$inject = ['$resource'];
    function YearsService($resource) {
        return $resource('api/years/:yearId', {
            yearId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
