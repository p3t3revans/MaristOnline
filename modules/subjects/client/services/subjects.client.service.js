'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('subjects').factory('Subjects', ['$resource',
  function ($resource) {
    return $resource('api/subjects/:subjectId', {
      subjectId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
      });
  }
]);

//Articles service used for communicating with the articles REST endpoints
angular.module('subjects').factory('SubYears', ['$resource',
  function ($resource) {
    return $resource('api/year/:year/semester/:semester', {
      year: '@year', semester: '@semseter'
    }
      );
  }
]);
