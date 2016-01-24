'use strict';

angular.module('core').controller('HomeController', ['$interval', 'PicturesFrontPage', '$scope', 'Authentication',
    function ($interval, PicturesFrontPage, $scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.picture1 = '';
        $scope.picture2 = '';
        // $scope.totalItems = 12;
        $scope.currentPage = 1;
        $scope.initial = true;
        // $scope.maxSize = 5;
        // $scope.setPage = function (pageNo) {
        //    $scope.currentPage = pageNo;
        // };

        //   $scope.pageChanged = function () {
        // $scope.setPage(2);
        //     $scope.getPictures();
        //  };
        var isOdd = function (num) { return num % 2; };
        var rotate = function () {
            $scope.pictures = PicturesFrontPage.get({ page: $scope.currentPage });
            $scope.pictures.$promise.then(function (response) {
                $scope.pictures = response.pictures;
                if (response.count !== -1) $scope.totalItems = response.count;
                if ($scope.currentPage === $scope.totalItems) {
                    $scope.currentPage = 1;
                }
                else {
                    $scope.currentPage++;
                }
                if (isOdd($scope.currentPage)) {
                    $scope.picture1 = $scope.pictures[0].picture;
                }
                else {
                    $scope.picture2 = $scope.pictures[0].picture;
                }
            });
        };

        $scope.getPictures = function () {
            rotate();rotate();
            $interval(rotate, 10000);
        }

    }
]);
