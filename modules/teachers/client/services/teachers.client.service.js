(function () {
    'use strict';
    angular
        .module('teachers.services')
        .factory('TeachersService', TeachersService);
    TeachersService.$inject = ['$resource'];
    function TeachersService($resource) {
        return $resource('api/teachers/:teacherId', {
            teacherId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
