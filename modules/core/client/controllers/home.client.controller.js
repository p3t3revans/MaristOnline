'use strict';

angular.module('core').controller('HomeController', ['$interval', 'PicturesFrontPage', '$scope', 'Authentication',
    function ($interval, PicturesFrontPage, $scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.totalItems = 12;
        $scope.currentPage = 1;
        $scope.initial = true;
        $scope.maxSize = 5;
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            // $scope.setPage(2);
            $scope.getPictures();
        };

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
            });
        };
 
        $scope.getPictures = function (){ 
         rotate(); 
         $interval(rotate, 10000);   
        }

    }
]);
