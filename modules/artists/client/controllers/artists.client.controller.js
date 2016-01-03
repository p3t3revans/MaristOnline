'use strict';

angular.module('artists')
    .controller('ArtistCtrl', ['Years', '$scope', '$stateParams', '$location', 'Artists', 'Authentication', function (Years, $scope, $stateParams, $location, Artists, Authentication) {
        $scope.authentication = Authentication;
        $scope.showUser = false;
        if ($scope.authentication.user.roles.indexOf('admin') !== -1 || $scope.authentication.user.roles.indexOf('teach') !== -1) $scope.showUser = true;
        var today = new Date();
        //var dd = today.getDate();
        //var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        // need to add these as mongo items as well
        $scope.yearSelect = yyyy;
        var setYearOption = function (select) {
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
        $scope.yearData = [];
        $scope.yearData = Years.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            setYearOption(yyyy);
        });

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

        $scope.create = function () {
            // Create new Artist object
            var artist = new Artists({
                name: $scope.artist.name,
                description: $scope.artist.description,
                yearEnrolled: $scope.yearData.selectedOption.year,
                house: $scope.house.selectedOption.name
            });

            // Redirect after save
            artist.$save(function (response) {
                $location.path('artists/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.description = '';
                $scope.yearEnrolled = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Artist
        $scope.remove = function (artist) {
            if (artist) {
                artist.$remove();

                for (var i in $scope.artists) {
                    if ($scope.artists[i] === artist) {
                        $scope.artists.splice(i, 1);
                    }
                }
            } else {
                $scope.artist.$remove(function () {
                    $location.path('artists');
                });
            }
        };

        // Update existing Artist
        $scope.update = function () {
            var artist = $scope.artist;
            artist.yearEnrolled = $scope.yearData.selectedOption.year;
            artist.house = $scope.house.selectedOption.name;
            artist.$update(function () {
                $location.path('artists/' + artist._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Artists
        $scope.find = function () {
            $scope.artists = Artists.query();
        };

        // Find existing Artist
        $scope.findOne = function () {
            $scope.artist = Artists.get({
                artistId: $stateParams.artistId
            });
            $scope.artist.$promise.then(function () {
                if ($scope.artist.yearEnrolled) {
                    setYearOption($scope.artist.yearEnrolled);

                }
                if ($scope.artist.house) {
                    for (var k = 0; k < $scope.house.availableOptions.length; k++) {
                        if ($scope.house.availableOptions[k].name === $scope.artist.house) {
                            $scope.house.selectedOption = $scope.house.availableOptions[k];
                            break;
                        }
                    }
                }
            });


        };
    }]);

  
  