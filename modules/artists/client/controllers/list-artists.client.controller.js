(function () {
    'use strict';
    angular
        .module('artists')
        .controller('ArtistsListController', ArtistsListController);
    ArtistsListController.$inject = ['ArtistYearEnrolled', '$scope', 'YearsService', 'ArtistsService'];
    function ArtistsListController(ArtistYearEnrolled, $scope, YearsService, ArtistsService) {
        var vm = this;
        //vm.artists = ArtistsService.query();
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
        });
        $scope.filterByYear = function () {
            vm.artists = ArtistYearEnrolled.query({ yearEnrolled: $scope.yearData.selectedOption.year });
        };
    }
}());
