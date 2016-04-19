'use strict';
angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ArticlesFrontPage', 'ArticlesLead',
    function ($scope, Authentication, ArticlesFrontPage, ArticlesLead) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.wait = true;
        $scope.currentPage = 1;
        var slideNumber = 0;
        var maxSlides = 4;
        var slideId = 1;
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides = $scope.slides = [];
        var currIndex = 0;
        //       $scope.addSlide = function() {
        //          var newWidth = 600 + slides.length + 1;
        //         slides.push({
        //             image: 'http://lorempixel.com/' + newWidth + '/300',
        //             text: ['Nice image', 'Awesome photograph', 'That is so cool', 'I love that'][slides.length % 4],
        //             id: currIndex++
        //         });
        //     };
        $scope.articles = ArticlesLead.get();
        $scope.articles.$promise.then(function (response) {
            $scope.title = response.articles[0].title;
            $scope.content = response.articles[0].content;
            $scope.picture = response.articles[0].picture;
            $scope.articles = response.articles;
            rotate();
        });
        $scope.addSlide = function () {
            // var newWidth = 600 + slides.length;
            slides.push({
                image: $scope.picture1,
                text: $scope.text,
                id: currIndex++,
                _id: $scope._id
            });
        };
        $scope.randomize = function () {
            var indexes = generateIndexesArray();
            assignNewIndexesToSlides(indexes);
        };
        //    for (var i = 0; i < 4; i++) {
        //        $scope.addSlide();
        //    }
        // Randomize logic below
        function assignNewIndexesToSlides(indexes) {
            for (var i = 0, l = slides.length; i < l; i++) {
                slides[i].id = indexes.pop();
            }
        }
        function generateIndexesArray() {
            var indexes = [];
            for (var i = 0; i < currIndex; ++i) {
                indexes[i] = i;
            }
            return shuffle(indexes);
        }
        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            var tmp, current, top = array.length;
            if (top) {
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }
            return array;
        }
        var rotate = function () {
            $scope.wait = true;
            //$scope.pictures = PicturesFrontPage.get({ page: $scope.currentPage });
            $scope.pictures = ArticlesFrontPage.get();
            $scope.pictures.$promise.then(function (response) {
                slides.length = 0;
                $scope.carousel = response.articles;
                /*      if (response.count !== -1) $scope.totalItems = response.count;
                       if ($scope.currentPage === $scope.totalItems) {
                           $scope.currentPage = 1;
                       }
                       else {
                           $scope.currentPage++;
                       }*/
                for (var i = 0; i < response.articles.length; i++) {
                    $scope.picture1 = $scope.carousel[i].picture;
                    $scope.text = $scope.carousel[i].title;
                    $scope._id = $scope.carousel[i]._id;
                    //slideId = i + 1;
                    $scope.addSlide();
                }
                // })
                // this is for the commented if }
                /*  if (isOdd($scope.currentPage)) {
                      $scope.picture1 = $scope.pictures[0].picture;
                  }
                  else {
                      $scope.picture2 = $scope.pictures[0].picture;
                  }*/
            });
            $scope.wait = false;
            return true;
        };
    }
]);
