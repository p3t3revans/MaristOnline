(function () {
    'use strict';
    angular
        .module('subjects.services')
        .factory('SubjectsService', SubjectsService);
    SubjectsService.$inject = ['$resource'];
    function SubjectsService($resource) {
        return $resource('api/subjects/:subjectId', {
            subjectId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
}());
angular.module('subjects').factory('SubYears', ['$resource',
    function ($resource) {
        return $resource('api/year/:year/semester/:semester', {
            year: '@year', semester: '@semseter'
        });
    }
]);
