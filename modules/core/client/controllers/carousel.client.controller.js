angular.module('core').controller('MyCarouselController', ['$interval', 'PicturesFrontPage', '$scope', 'Authentication',
    function ($interval, PicturesFrontPage, $scope, Authentication) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        var slideNumber = 0;
        var maxSlides = 4;
        $scope.myInterval = 5000;
        var slides = $scope.slides = [];
        $scope.addSlide = function () {
            // var newWidth = 600 + slides.length;
            slides.push({
                image: $scope.picture1,
                text: $scope.text
            });
        };
        // var isOdd = function (num) { return num % 2; };
        var rotate = function () {
            $scope.pictures = PicturesFrontPage.get({ page: $scope.currentPage });
            $scope.pictures.$promise.then(function (response) {
                slides.length = 0;
                $scope.pictures = response.pictures;
                if (response.count !== -1) $scope.totalItems = response.count;
                if ($scope.currentPage === $scope.totalItems) {
                    $scope.currentPage = 1;
                }
                else {
                    $scope.currentPage++;
                }
                for (var i = 0; i < response.pictures.length; i++) {
                    $scope.picture1 = $scope.pictures[i].picture;
                    $scope.text = $scope.pictures[i].title;
                    $scope.addSlide();
                }
 
                /*  if (isOdd($scope.currentPage)) {
                      $scope.picture1 = $scope.pictures[0].picture;
                  }
                  else {
                      $scope.picture2 = $scope.pictures[0].picture;
                  }*/
            });
            return true;
        };
        rotate();

        /*    for (var i = 0; i < 10; i++) {
    
                rotate((i + 1));
            }*/
        $interval(rotate, 600000);
    }
]);