(function () {
    'use strict';
    angular
        .module('articles')
        .controller('ArticlesListController', ArticlesListController);
    ArticlesListController.$inject = ['ArticlesList', '$scope'];
    function ArticlesListController(ArticlesList, $scope) {
        var vm = this;
        vm.wait = true;
        $scope.maxSize = 5;
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.pageChanged = function () {
            vm.articles = ArticlesList.get({ page: $scope.currentPage, count: $scope.totalItems });
            vm.articles.$promise.then(function (result) {
                vm.wait = true;
                vm.articles = result.articles;
                if (result.count !== -1)
                    $scope.totalItems = result.count;
                vm.wait = false;
            });
        };
        $scope.pageChanged();
    }
}());
