(function () {
    'use strict';

    angular
        .module('pictures')
        .controller('PicturesController', PicturesController);

    PicturesController.$inject = ['ArtistYearEnrolled', 'SubYears', 'YearsService', 'MediumsService', '$scope', '$timeout', '$state', 'pictureResolve', '$window', 'Authentication', 'FileUploader'];

    function PicturesController(ArtistYearEnrolled, SubYears, YearsService, MediumsService, $scope, $timeout, $state, picture, $window, Authentication, FileUploader) {
        var vm = this;
        //
        vm.picture = picture;
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1) vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        //used to setup the year drop down 
        var today = new Date();
        var yyyy = today.getFullYear();
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
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            if (vm.picture.year) {
                setYearOption(vm.picture.year);
            }
            else {
                //setYearOption(yyyy);
            }
        })
        // year level drop down
        /* this is not need for the picture as it is based on the subject
        $scope.yearLevelData = {
            availableOptions: [
                { yearLevel: 7 },
                { yearLevel: 8 },
                { yearLevel: 9 },
                { yearLevel: 10 },
                { yearLevel: 11 },
                { yearLevel: 12 }
            ],
            selectedOption: { yearLevel: 7 } //This sets the default value of the select in the ui
        };
        */
        //semester dropdown
        $scope.semesterData = {
            availableOptions: [
                { semester: 1 },
                { semester: 2 }
            ],
            selectedOption: { semester: 1 } //This sets the default value of the select in the ui
        };
        //mediums drop down
        $scope.medium = [];
        $scope.data = [];
        $scope.medium = MediumsService.query();
        $scope.medium.$promise.then(function (result) {
            $scope.data = result;
            if (vm.picture.medium) {
                for (var x = 0; x < $scope.data.length; x++) {
                    if ($scope.data[x].title == vm.picture.medium) {
                        $scope.data.selectedOption = $scope.data[x];
                    }
                }
            }
            else {
                $scope.data.selectedOption = $scope.data[0];
            }

        })
        //subject dropdown
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
        //artist dropdown
        $scope.changeArtists = function () {
            $scope.dataArtist = [];
            var yearEnrolled = $scope.yearData.selectedOption.year + (7 - $scope.dataSubject.selectedOption.yearLevel);
            $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            $scope.artists.$promise.then(function () {
                for (var x = 0; x < $scope.artists.length; x++) {
                    if ($scope.artists[x].active) {
                        $scope.dataArtist.push($scope.artists[x]);
                    }
                }

            })
        };
        //set up for the picture if it is edit mode 
        if (vm.picture._id) {
            $scope.dataArtist = [];
            $scope.dataSubject = [];
            //$scope.load();
            if (vm.picture.yearLevel) {
                var yearEnrolled = vm.picture.year + (7 - vm.picture.yearLevel);
                $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
                $scope.artists.$promise.then(function (result) {
                    for (var c = 0; c < result.length; c++) {
                        if (result[c].active) {
                            $scope.dataArtist.push(result[c]);
                        }
                    }
                    for (var z = 0; z < $scope.dataArtist.length; z++) {
                        if ($scope.dataArtist[z].name === vm.picture.artistName) {
                            $scope.dataArtist.selectedOption = $scope.dataArtist[z];
                            break;
                        }
                    }
                });
            }
            if (vm.picture.semester) {
                var len = $scope.semesterData.availableOptions.length;
                for (var k = 0; k < len; k++) {
                    if ($scope.semesterData.availableOptions[k].semester === vm.picture.semester) {
                        $scope.semesterData.selectedOption = $scope.semesterData.availableOptions[k];
                        break;
                    }
                }
            }
            $scope.subjects = SubYears.query({ year: vm.picture.year, semester: vm.picture.semester });
            $scope.subjects.$promise.then(function (result) {
                $scope.dataSubject = result;
                var lenSub = $scope.dataSubject.length;
                for (var a = 0; a < lenSub; a++) {
                    if ($scope.dataSubject[a]._id === vm.picture.subject) {
                        $scope.dataSubject.selectedOption = $scope.dataSubject[a];
                        break;
                    }
                }
            });

        }
        // load picture for file selector
        $scope.addPicture = function (element) {
            if (element.files && element.files[0]) {
                var FR = new FileReader();
                FR.onload = function (e: any) {
                    $scope.$apply(function ($scope) {
                        vm.picture.picture = e.target.result;
                    });
                };
                FR.readAsDataURL(element.files[0]);

            }
        };//closure for addPicture

        // Remove existing Picture
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.picture.$remove($state.go('pictures.list'));
            }
        }

        // Save Picture
        function save(isValid) {
            vm.picture.artist = $scope.dataArtist.selectedOption._id;
            vm.picture.artistName = $scope.dataArtist.selectedOption.name;
            vm.picture.year = $scope.yearData.selectedOption.year;
            vm.picture.medium = $scope.data.selectedOption.title;
            vm.picture.subject = $scope.dataSubject.selectedOption._id;
            vm.picture.teacher = $scope.dataSubject.selectedOption.teacher;
            vm.picture.subjectName = $scope.dataSubject.selectedOption.title;
            vm.picture.semester = $scope.semesterData.selectedOption.semester;
            vm.picture.yearLevel = $scope.dataSubject.selectedOption.yearLevel;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.pictureForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.picture._id) {
                vm.picture.$update(successCallback, errorCallback);
            } else {
                vm.picture.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('pictures.view', {
                    pictureId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        vm.cancelUpload = cancelUpload;
        // Create file uploader instance
        vm.uploader = new FileUploader({
            url: 'api/users/picture',
            alias: 'newProfilePicture',
            onAfterAddingFile: onAfterAddingFile,
            onSuccessItem: onSuccessItem,
            onErrorItem: onErrorItem
        });

        // Set file uploader image filter
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Called after the user selected a new picture file
        function onAfterAddingFile(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fre: FileReaderEvent) {
                    $timeout(function () {
                        var sizePicture = Math.ceil(fre.target.result.length / 1400);
                        if (sizePicture > 100) alert('Picture size is ' + sizePicture + ' KBs Max size is 100 KBs');
                        else vm.picture.picture = fre.target.result;
                    }, 0);
                };
            }
        }

        // Called after the user has successfully uploaded a new picture
        function onSuccessItem(fileItem, response, status, headers) {
            // Show success message
            vm.success = true;

            // Populate user object
            vm.user = Authentication.user = response;

            // Clear upload buttons
            cancelUpload();
        }

        // Called after the user has failed to uploaded a new picture
        function onErrorItem(fileItem, response, status, headers) {
            // Clear upload buttons
            cancelUpload();

            // Show error message
            vm.error = response.message;
        }

        // Change user profile picture
        function uploadProfilePicture() {
            // Clear messages
            vm.success = vm.error = null;

            // Start upload
            vm.uploader.uploadAll();
        }

        // Cancel the upload process
        function cancelUpload() {
            vm.uploader.clearQueue();
            vm.imageURL = vm.user.profileImageURL;
        }
    }
} ());
