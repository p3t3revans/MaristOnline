(function() {
    'use strict';

    angular
        .module('pictures')
        .controller('PicturesListController', PicturesListController);

    PicturesListController.$inject = ['PicturesByYear', 'PicturesByArtist', 'PicturesPage', 'YearsService', 'ArtistYearEnrolled', 'PicturesService', '$scope', "ArtistsService"];

    function PicturesListController(PicturesByYear, PicturesByArtist, PicturesPage, YearsService, ArtistYearEnrolled, PicturesService, $scope, ArtistsService) {
        var vm = this;
        //list load and pagination
        vm.wait = false;
        $scope.maxSize = 5;
        $scope.totalItems = 1;
        $scope.currentPage = 1;
      //  vm.totalItems = 12;
       // vm.currentPage = 1;
       // vm.maxSize = 5;
        //$scope.per_page = 5;
        //$scope.numPages = $scope.bigTotalItems / $scope.per_page;
       // $scope.setPage = function(pageNo) {
       //     vm.currentPage = pageNo;

        $scope.listedBy = 'getPictures';
        
        $scope.pageChanged = function() {
            if ($scope.listedBy === 'getPictures') {
                $scope.getPictures();
            }
            else if ($scope.listedBy === 'getPicturesByArtist') {
                getPicturesByArtist();
            }
            else if ($scope.listedBy === 'getPicturesByYear') {
                getPicturesByYear();
            }

        };

        $scope.yearListData = [];
        $scope.yearListData = YearsService.query();
        $scope.yearListData.$promise.then(function(result) {
            $scope.yearData = result;
        })
        //       vm.pictures = PicturesService.query();
        //      vm.pictures.$promise.then(function(result) {
        //          vm.pictures = result;
        //          vm.wait = false;
        //      }
        //      );
        var changeArtists = function() {
            $scope.dataArtist = [];
            var yearEnrolled = $scope.yearData.selectedOption.year;
            $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            $scope.artists.$promise.then(function(result) {
                $scope.dataArtist = result;
            })
        };
        $scope.getPictures = function() {
            vm.wait = true;
            vm.pictures = PicturesPage.get({ page: $scope.currentPage });
            vm.pictures.$promise.then(function(response) {
                vm.wait = false;
                vm.pictures = response.pictures;
                $scope.dataArtist = [];
                if (response.count !== -1) $scope.totalItems = response.count;
                vm.wait = false;

            });

        };
        //$scope.getPictures();
        $scope.artistChanged = function() {
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            getPicturesByArtist();
        }
        var getPicturesByArtist = function() {
            vm.wait = true;
            $scope.listedBy = 'getPicturesByArtist';
            vm.pictures = PicturesByArtist.get({ artistId: $scope.dataArtist.selectedOption._id, page: $scope.currentPage, count: $scope.totalItems });
            vm.pictures.$promise.then(function(response) {
                vm.wait = false;
                vm.pictures = response.pictures;
                if (response.count !== -1) $scope.totalItems = response.count;
            });
        };
        $scope.yearListChanged = function() {
            changeArtists();
            $scope.currentPage = 1;
            $scope.totalItems = 0;
           // getPicturesByYear();
        }
        var getPicturesByYear = function() {
            vm.wait = true;
            $scope.listedBy = 'getPicturesByYear';
            vm.pictures = PicturesByYear.get({ year: $scope.yearListData.selectedOption.year, page: $scope.currentPage, count: $scope.totalItems });
            vm.pictures.$promise.then(function(response) {
                vm.pictures = response.pictures;
                if (response.count !== -1) $scope.totalItems = response.count;
                vm.wait = false
            });
        };
    }
} ());
