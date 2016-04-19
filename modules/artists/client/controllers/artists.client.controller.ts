(function() {
    'use strict';

    angular
        .module('artists')
        .controller('ArtistsController', ArtistsController);

    ArtistsController.$inject = ['PicturesByArtist', 'YearsService', '$scope', '$state', 'artistResolve', '$window', 'Authentication'];

    function ArtistsController(PicturesByArtist, YearsService, $scope, $state, artist, $window, Authentication) {
        var vm = this;
        //save
        vm.artist = artist;
        vm.authentication = Authentication;
        vm.showUser = false
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1) vm.showUser = true;
        }
        vm.wait = false;
        $scope.totalItems = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.per_page = 10;
        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.pageChanged = function() {
            getPicturesByArtist();
        };

        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // year selection data
        var today = new Date();
        var yyyy = today.getFullYear();
        $scope.yearSelect = yyyy;
        var setYearOption = function(select) {
            if (select) {
                yyyy = select;
                for (var x = 0; x < $scope.yearData.length; x++) {
                    if ($scope.yearData[x].year === select) {
                        $scope.yearData.selectedOption = $scope.yearData[x];
                        break;
                    }
                }
            }
        };
        var setHouseOption = function(house) {
            for (var k = 0; k < $scope.house.availableOptions.length; k++) {
                if ($scope.house.availableOptions[k].name === house) {
                    $scope.house.selectedOption = $scope.house.availableOptions[k];
                    break;
                }
            }

        }


        $scope.yearData = [];
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function(result) {
            $scope.yearData = result;
            if (vm.artist.yearEnrolled) {
                yyyy = vm.artist.yearEnrolled;
            }
            setYearOption(yyyy);
        });

        // house data for dropdown
        $scope.house = {
            availableOptions: [
                { name: 'Conway' },
                { name: 'Crispin' },
                { name: 'Darlinghurst' },
                { name: 'Haydon' },
                { name: 'Mark' },
                { name: 'McMahon' },
                { name: 'Othmar' },
                { name: 'Patrick' }
            ]
        };
        if (vm.artist.house) {
            setHouseOption(vm.artist.house);
        }
        // Remove existing Artist
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.artist.$remove($state.go('artists.list'));
            }
        }

        // Save Artist
        function save(isValid) {
            vm.artist.yearEnrolled = $scope.yearData.selectedOption.year;
            vm.artist.house = $scope.house.selectedOption.name;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.artistForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.artist._id) {
                vm.artist.$update(successCallback, errorCallback);
            } else {
                vm.artist.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('artists.view', {
                    artistId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        //$scope.getPictures();
        $scope.artistChanged = function() {
            $scope.currentPage = 1;
            $scope.totalItems = 0;
            getPicturesByArtist();
        }
        var getPicturesByArtist = function() {
            vm.wait = true;
            vm.pictures = PicturesByArtist.get({ artistId: vm.artist._id, page: $scope.currentPage, count: $scope.totalItems  });
            vm.pictures.$promise.then(function(response) {
                vm.wait = false;
                vm.pictures = response.pictures;
                if (response.count !== -1) $scope.totalItems = response.count;
            });
        };
    }
} ());
