'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
    function ($scope, $stateParams, $location, Authentication, Articles) {
        $scope.authentication = Authentication;
        
        $scope.addPicture = function (element) {
            if (element.files && element.files[0]) {
                var FR = new FileReader();
                FR.onload = function (e) {
                    $scope.$apply(function ($scope) {
                        $scope.picture = e.target.result;
                    });
                };
                FR.readAsDataURL(element.files[0]);

            }
        };//closure for addPicture
        // Create new Article
        $scope.create = function () {
            // Create new Article object
            var article = new Articles({
                title: this.title,
                content: this.content,
                picture: this.picture,
                displayFrontPage: this.displayFrontPage
            });

            // Redirect after save
            article.$save(function (response) {
                $location.path('articles/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.content = '';
                $scope.picture = '';
                $scope.displayFrontPage = false;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Article
        $scope.remove = function (article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function () {
                    $location.path('articles');
                });
            }
        };

        // Update existing Article
        $scope.update = function () {
            var article = $scope.article;

            article.$update(function () {
                $location.path('articles/' + article._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Articles
        $scope.find = function () {
            $scope.articles = Articles.query();
        };

        // Find existing Article
        $scope.findOne = function () {
            $scope.article = Articles.get({
                articleId: $stateParams.articleId
            });
        };
    }
]);
