(function () {
    'use strict';
    angular
        .module('subjects')
        .controller('SubjectsController', SubjectsController);
    SubjectsController.$inject = ['SubjectsService', 'YearsService', 'TeachersService', 'ArtistYearEnrolled', 'SubYears', '$scope', '$state', 'subjectResolve', '$window', 'Authentication'];
    function SubjectsController(SubjectsService, YearsService, TeachersService, ArtistYearEnrolled, SubYears, $scope, $state, subject, $window, Authentication) {
        var vm = this;
        //
        vm.subject = subject;
        if (!vm.subject.artists)
            vm.subject.artists = [];
        vm.authentication = Authentication;
        vm.showUser = false;
        if (vm.authentication.user != '') {
            if (vm.authentication.user.roles.indexOf('admin') == 1 || vm.authentication.user.roles.indexOf('teach') == 1)
                vm.showUser = true;
        }
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        //$scope.showUser = false;
        $scope.teacher = TeachersService.query();
        $scope.teacher.$promise.then(function (result) {
            $scope.teacherData = result;
            if (vm.subject.teacher) {
                for (var j = 0; j < $scope.teacherData.length; j++) {
                    if ($scope.teacherData[j].title === vm.subject.teacher) {
                        $scope.teacherData.selectedOption = $scope.teacherData[j];
                        break;
                    }
                }
            }
            //$scope.teacherData.selectedOption = $scope.teacherData[0];
        });
        //  if ($scope.authentication.user.roles.indexOf('admin') !== -1 || $scope.authentication.user.roles.indexOf('teach') !== -1) $scope.showUser = true;
        $scope.yearSelect = 'All';
        $scope.semesterSelect = 'All';
        $scope.arrayArtists = [];
        $scope.artists = [];
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
            if (vm.subject.year)
                setYearOption(vm.subject.year);
        });
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
        $scope.semesterData = {
            availableOptions: [
                { semester: 1 },
                { semester: 2 }
            ],
            selectedOption: { semester: 1 } //This sets the default value of the select in the ui
        };
        if (vm.subject._id) {
            if (vm.subject.yearLevel) {
                var yearEnrolled = vm.subject.year + (7 - vm.subject.yearLevel);
                $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
                $scope.artists.$promise.then(function () {
                    for (var y = 0; y < $scope.artists.length; y++) {
                        if (vm.subject.artists.indexOf($scope.artists[y]._id) > -1) {
                            $scope.artists[y].selected = true;
                        }
                    }
                });
                var l = $scope.yearLevelData.availableOptions.length;
                for (var i = 0; i < l; i++) {
                    if ($scope.yearLevelData.availableOptions[i].yearLevel === vm.subject.yearLevel) {
                        $scope.yearLevelData.selectedOption = $scope.yearLevelData.availableOptions[i];
                        break;
                    }
                }
            }
            if (vm.subject.semester) {
                var len = $scope.semesterData.availableOptions.length;
                for (var k = 0; k < len; k++) {
                    if ($scope.semesterData.availableOptions[k].semester === vm.subject.semester) {
                        $scope.semesterData.selectedOption = $scope.semesterData.availableOptions[k];
                        break;
                    }
                }
            }
        }
        $scope.findArtistForSubject = function () {
            $scope.subject = SubjectsService.get({
                subjectId: vm.subject._id
            });
            $scope.subject.$promise.then(function () {
                var yearEnrolled = $scope.subject.year + (7 - $scope.subject.yearLevel);
                $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            });
        };
        // Find existing Subject
        $scope.changeArtists = function () {
            var yearEnrolled = $scope.yearData.selectedOption.year + (7 - $scope.yearLevelData.selectedOption.yearLevel);
            $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
            $scope.artists.$promise.then(function () {
                for (var x = 0; x < $scope.artists.length; x++) {
                    if ($scope.subject.artists.indexOf($scope.artists[x]._id) > -1) {
                        $scope.artists[x].selected = true;
                    }
                }
            });
        };
        // Remove existing Subject
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.subject.$remove($state.go('subjects.list'));
            }
        }
        // Save Subject
        function save(isValid) {
            vm.subject.yearLevel = $scope.yearLevelData.selectedOption.yearLevel;
            vm.subject.year = $scope.yearData.selectedOption.year;
            vm.subject.semester = $scope.semesterData.selectedOption.semester;
            vm.subject.teacher = $scope.teacherData.selectedOption.title;
            for (var i = 0; i < $scope.artists.length; i++) {
                if ($scope.artists[i].selected) {
                    var find = vm.subject.artists.indexOf($scope.artists[i]._id);
                    if (find === -1) {
                        vm.subject.artists.push($scope.artists[i]._id);
                    }
                }
                else {
                    var at = vm.subject.artists.indexOf($scope.artists[i]._id);
                    if (at !== -1) {
                        vm.subject.artists.splice(at, 1);
                    }
                }
            }
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.subjectForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.subject._id) {
                vm.subject.$update(successCallback, errorCallback);
            }
            else {
                vm.subject.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('subjects.view', {
                    subjectId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
