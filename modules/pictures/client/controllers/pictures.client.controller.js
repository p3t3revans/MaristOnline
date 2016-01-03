'use strict';

angular.module('pictures')
    .controller('PictureCtrl', ['PicturesPage', 'Years', 'ArtistYearEnrolled', 'SubYears', 'Artists', 'Subjects', '$rootScope', '$scope', '$stateParams', '$location', 'Pictures', 'Authentication', 'Mediums', function (PicturesPage, Years, ArtistYearEnrolled, SubYears, Artists, Subjects, $rootScope, $scope, $stateParams, $location, Pictures, Authentication, Mediums) {
        //Pagination
        $scope.loading = false;
        $scope.totalItems = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            // $scope.setPage(2);
            $scope.getPictures();
        };

        $scope.authentication = Authentication;
        $scope.showUser = false;
        if ($scope.authentication.user.roles.indexOf('admin') !== -1 || $scope.authentication.user.roles.indexOf('teach') !== -1) $scope.showUser = true;
        $scope.headingTitle = 'List Pictures';
        $scope.dataSubject = [];
        $scope.dataArtist = [];
        $scope.picture = new Pictures();
        $scope.picture.picture = '';
        var today = new Date();
        //var dd = today.getDate();
        //var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        // need to add these as mongo items as well
        // $scope.dataSubject;
        $scope.semesterSelect = 1;
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
        }
        $scope.yearData = [];
        $scope.yearData = Years.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            setYearOption(yyyy);
        });



        $scope.medium = [];
        $scope.data = [];
        $scope.medium = Mediums.query();
        $scope.medium.$promise.then(function (result) {
            $scope.data = result;
            $scope.data.selectedOption = $scope.data[0];
        })
        $scope.semesterData = {
            availableOptions: [
                { semester: 1 },
                { semester: 2 }
            ],
            selectedOption: { semester: 1 } //This sets the default value of the select in the ui
        };
        $scope.load = function () {
            $scope.dataArtist = [];
            $scope.dataSubject = [];
            $scope.semesterSelect = $scope.semesterData.selectedOption.semester;
            $scope.yearSelect = $scope.yearData.selectedOption.year;
            $scope.subjects = SubYears.query({ year: $scope.yearSelect, semester: $scope.semesterSelect });
            $scope.subjects.$promise.then(function (result) {
                $scope.dataSubject = result;
            });

        };

        $scope.changeArtists = function () {
            $scope.dataArtist = [];
            var yearEnrolled = $scope.yearData.selectedOption.year + (7 - $scope.dataSubject.selectedOption.yearLevel);
            $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            $scope.artists.$promise.then(function () {
                for (var x = 0; x < $scope.artists.length; x++) {
                    if ($scope.dataSubject.selectedOption.artists.indexOf($scope.artists[x]._id) > -1) {
                        $scope.dataArtist.push($scope.artists[x]);
                    }
                }

            })
        };
        $scope.addPicture = function (element) {
            if (element.files && element.files[0]) {
                var FR = new FileReader();
                FR.onload = function (e) {
                    $scope.$apply(function ($scope) {
                        $scope.picture.picture = e.target.result;
                    });
                };
                FR.readAsDataURL(element.files[0]);

            }
        };//closure for addPicture
  

        $scope.create = function () {
            // Create new Picture object
            var picture = new Pictures({
                title: $scope.picture.title,
                description: $scope.picture.description,
                artist: $scope.dataArtist.selectedOption._id,
                artistName: $scope.dataArtist.selectedOption.name,
                year: $scope.yearData.selectedOption.year,
                medium: $scope.data.selectedOption.title,
                picture: $scope.picture.picture,
                subject: $scope.dataSubject.selectedOption._id
            });

            // Redirect after save
            picture.$save(function (response) {
                $location.path('pictures/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.description = '';
                $scope.teacher = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Picture
        $scope.remove = function (picture) {
            if (picture) {
                picture.$remove();

                for (var i in $scope.pictures) {
                    if ($scope.pictures[i] === picture) {
                        $scope.pictures.splice(i, 1);
                    }
                }
            } else {
                $scope.picture.$remove(function () {
                    $location.path('pictures');
                });
            }
        };

        // Update existing Picture
        $scope.update = function () {
            var picture = $scope.picture;
            picture.artist = $scope.dataArtist.selectedOption._id;
            picture.artistName = $scope.dataArtist.selectedOption.name;
            picture.year = $scope.yearData.selectedOption.year;
            picture.medium = $scope.data.selectedOption.title;
            picture.subject = $scope.dataSubject.selectedOption._id;
            picture.$update(function () {
                $location.path('pictures/' + picture._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            }
                );
        };

        // Find a list of Pictures
        $scope.find = function () {
            $scope.pictures = Pictures.query();
            $scope.pictures.$promise.then(function () {

            })
        };
        $scope.getPictures = function () {
            $scope.pictures = PicturesPage.get({ page: $scope.currentPage });
            $scope.pictures.$promise.then(function (response) {
                $scope.pictures = response.pictures;
                if (response.count !== -1) $scope.totalItems = response.count;
                $scope.loading = false;
            });
        };
        // Find existing Picture
        $scope.findOne = function () {
            $scope.picture = Pictures.get({
                pictureId: $stateParams.pictureId
            });
            $scope.picture.$promise.then(function () {
                if ($scope.picture.medium) {
                    for (var x = 0; x < $scope.data.length; x++) {
                        if ($scope.data[x].title === $scope.picture.medium) {
                            $scope.data.selectedOption = $scope.data[x];
                            break;
                        }
                    }
                }
                setYearOption($scope.picture.year);
                $scope.subjects = Subjects.query();
                $scope.subjects.$promise.then(function (result) {
                    $scope.dataSubject = result;
                    if ($scope.picture.subject) {
                        var l = $scope.dataSubject.length;
                        for (var i = 0; i < l; i++) {
                            if ($scope.dataSubject[i]._id === $scope.picture.subject) {
                                $scope.dataSubject.selectedOption = $scope.dataSubject[i];
                                break;
                            }
                        }
                        var yearEnrolled = $scope.yearData.selectedOption.year + (7 - $scope.dataSubject.selectedOption.yearLevel);
                        $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
                        $scope.artists.$promise.then(function () {
                            for (var x = 0; x < $scope.artists.length; x++) {
                                if ($scope.dataSubject.selectedOption.artists.indexOf($scope.artists[x]._id) > -1) {
                                    $scope.dataArtist.push($scope.artists[x]);
                                }
                            }
                            for (var i = 0; i < $scope.dataArtist.length; i++) {
                                if ($scope.dataArtist[i]._id === $scope.picture.artist) {
                                    $scope.dataArtist.selectedOption = $scope.dataArtist[i];
                                    break;
                                }
                            }
                        })
                    }

                });
            });
        };
    }]);

  
  