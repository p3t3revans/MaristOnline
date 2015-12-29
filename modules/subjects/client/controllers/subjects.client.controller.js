'use strict';

angular.module('subjects')
    .controller('SubjectCtrl', ['Years', 'Teachers', 'ArtistYearEnrolled', 'SubYears', '$scope', '$stateParams', '$location', 'Subjects', 'Authentication', function (Years, Teachers, ArtistYearEnrolled, SubYears, $scope, $stateParams, $location, Subjects, Authentication) {
        $scope.authentication = Authentication;
        $scope.showUser = false;
        if ($scope.authentication.user.roles.indexOf('admin') !== -1 || $scope.authentication.user.roles.indexOf('teach') !== -1) $scope.showUser = true;
        $scope.yearSelect = 'All';
        $scope.semesterSelect = 'All';
        $scope.arrayArtists = [];
        $scope.artists = [];
        var today = new Date();
        //var dd = today.getDate();
        //var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        // need to add these as mongo items as well
       
        var setYearOption = function (select) {
            if (select) {
                for (var x = 0; x < $scope.yearData.length; x++) {
                    if ($scope.yearData[x].year === select) {
                        $scope.yearData.selectedOption = $scope.yearData[x];
                        break;
                    }
                }
            }
        };
        $scope.yearData = Years.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            setYearOption(yyyy);
        })

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

        $scope.teacher = [];
        $scope.teacherData = [];
        $scope.teacher = Teachers.query();
        $scope.teacher.$promise.then(function (result) {
            $scope.teacherData = result;
            $scope.teacherData.selectedOption = $scope.teacherData[0];
        })


        $scope.create = function () {
            // Create new Subject object
            for (var i = 0; i < $scope.artists.length; i++) {
                if ($scope.artists[i].selected) {
                    var find = $scope.arrayArtists.indexOf($scope.artists[i]._id);
                    if (find === -1) {
                        $scope.arrayArtists.push($scope.artists[i]._id);
                    }
                }
            };
            var subject = new Subjects({
                title: $scope.subject.title,
                description: $scope.subject.description,
                yearLevel: $scope.yearLevelData.selectedOption.yearLevel,
                year: $scope.yearData.selectedOption.year,
                semester: $scope.semesterData.selectedOption.semester,
                teacher: $scope.teacherData.selectedOption.title,
                artists: $scope.arrayArtists
            });

            // Redirect after save
            subject.$save(function (response) {
                $location.path('subjects/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.description = '';
                $scope.teacher = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Subject
        $scope.remove = function (subject) {
            if (subject) {
                subject.$remove();

                for (var i in $scope.subjects) {
                    if ($scope.subjects[i] === subject) {
                        $scope.subjects.splice(i, 1);
                    }
                }
            } else {
                $scope.subject.$remove(function () {
                    $location.path('subjects');
                });
            }
        };

        // Update existing Subject
        $scope.update = function () {
            var subject = $scope.subject;
            for (var i = 0; i < $scope.artists.length; i++) {
                if ($scope.artists[i].selected) {
                    var find = subject.artists.indexOf($scope.artists[i]._id);
                    if (find === -1) {
                        subject.artists.push($scope.artists[i]._id);
                    }
                }
                else {
                    var at = subject.artists.indexOf($scope.artists[i]._id);
                    if (at !== -1) {
                        subject.artists.splice(at, 1);
                    }
                }
            }
            subject.teacher = $scope.teacherData.selectedOption.title;
            subject.yearLevel = $scope.yearLevelData.selectedOption.yearLevel;
            subject.semester = $scope.semesterData.selectedOption.semester;
            subject.year = $scope.yearData.selectedOption.year;

            subject.$update(function () {
                $location.path('subjects/' + subject._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Subjects
        $scope.find = function () {
            $scope.subjects = Subjects.query();
        };
        $scope.findByYear = function () {
            $scope.yearSelect = $scope.yearData.selectedOption.year;
            $scope.semesterSelect = $scope.semesterData.selectedOption.semester;
            $scope.subjects = SubYears.query({ year: $scope.yearData.selectedOption.year, semester: $scope.semesterData.selectedOption.semester });
        };

        $scope.findArtistForSubject = function () {
            $scope.subject = Subjects.get({
                subjectId: $stateParams.subjectId
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

        $scope.findOne = function () {
            $scope.subject = Subjects.get({
                subjectId: $stateParams.subjectId
            });
            $scope.subject.$promise.then(function () {
                if ($scope.subject.yearLevel) {
                    var yearEnrolled = $scope.subject.year + (7 - $scope.subject.yearLevel);
                    $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
                    $scope.artists.$promise.then(function () {
                        for (var y = 0; y < $scope.artists.length; y++) {
                            if ($scope.subject.artists.indexOf($scope.artists[y]._id) > -1) {
                                $scope.artists[y].selected = true;
                            }
                        }
                    });
                    var l = $scope.yearLevelData.availableOptions.length;
                    for (var i = 0; i < l; i++) {
                        if ($scope.yearLevelData.availableOptions[i].yearLevel === $scope.subject.yearLevel) {
                            $scope.yearLevelData.selectedOption = $scope.yearLevelData.availableOptions[i];
                            break;
                        }
                    }
                }
                if ($scope.subject.year) {
                    setYearOption($scope.subject.year);
                }
                if ($scope.subject.teacher) {
                    for (var y = 0; y < $scope.teacherData.length; y++) {
                        if ($scope.teacherData[y].title === $scope.subject.teacher) {
                            $scope.teacherData.selectedOption = $scope.teacherData[y];
                            break;
                        }
                    }
                }

            });

        };

        $scope.findOneView = function () {
            $scope.subject = Subjects.get({
                subjectId: $stateParams.subjectId
            });
            $scope.subject.$promise.then(function () {
                if ($scope.subject.yearLevel) {
                    var yearEnrolled = $scope.subject.year + (7 - $scope.subject.yearLevel);
                    var temp = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
                    temp.$promise.then(function () {
                        for (var y = 0; y < temp.length; y++) {
                            if ($scope.subject.artists.indexOf(temp[y]._id) !== -1) {
                                $scope.artists.push(temp[y]);
                            }
                        }
                    });

                }

            });

        };

    }]);

  
  