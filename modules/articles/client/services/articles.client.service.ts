(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource'];

  function ArticlesService($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());


//ArticlesFrontPage service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesFrontPage', ['$resource',
  function ($resource) {
    return $resource('api/articlesfp')
  }
]);
//ArticlesList service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesList', ['$resource',
  function ($resource) {
    return $resource('/api/articles/page/:page/count/:count')
  }
]);
//ArticlesLead service used for communicating with the articles REST endpoints
angular.module('articles').factory('ArticlesLead', ['$resource',
  function ($resource) {
    return $resource('api/articleslead')
  }
]);
