'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
  function ($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//ArticlesFrontPage service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesFrontPage', ['$resource',
  function ($resource) {
    return $resource('api/articlesfp')
  }
]);

//ArticlesLead service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesLead', ['$resource',
  function ($resource) {
    return $resource('api/articleslead')
  }
]);

