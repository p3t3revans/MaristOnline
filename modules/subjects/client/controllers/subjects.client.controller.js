'use strict';

angular.module('subjects')
  .controller('SubjectCtrl', ['ArtistYearEnrolled', 'Years', '$scope', '$stateParams', '$location', 'Subjects', 'Authentication', function (ArtistYearEnrolled, Years, $scope, $stateParams, $location, Subjects, Authentication) {
    $scope.authentication = Authentication;
    $scope.yearSelect = 'All';
    $scope.semesterSelect = 'All';
    var today = new Date();
    //var dd = today.getDate();
    //var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    // need to add these as mongo items as well
    $scope.yearData = {
      availableOptions: [
        { year: 2015 },
        { year: 2016 },
        { year: 2017 },
        { year: 2018 },
        { year: 2019 },
        { year: 2020 },
        { year: 2021 }
      ]//,
      //selectedOption: { } //This sets the default value of the select in the ui
    };

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
      ]//,
      //selectedOption: { } //This sets the default value of the select in the ui
    };



    $scope.create = function () {
      // Create new Subject object
      var subject = new Subjects({
        title: $scope.subject.title,
        description: $scope.subject.description,
        yearLevel: $scope.yearLevelData.selectedOption.yearLevel,
        year: $scope.yearData.selectedOption.year,
        semester: $scope.semesterData.selectedOption.semester,
        teacher: $scope.subject.teacher
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
      $scope.subjects = Years.query({ year: $scope.yearData.selectedOption.year, semester: $scope.semesterData.selectedOption.semester });
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
    }
    $scope.findOne = function () {
      $scope.subject = Subjects.get({
        subjectId: $stateParams.subjectId
      });
      $scope.subject.$promise.then(function () {
        if ($scope.subject.yearLevel) {
          var yearEnrolled = $scope.subject.year + (7 - $scope.subject.yearLevel);
          $scope.artists = ArtistYearEnrolled.query({ yearEnrolled: yearEnrolled });
          var l = $scope.yearLevelData.availableOptions.length;
          for (var i = 0; i < l; i++) {
            if ($scope.yearLevelData.availableOptions[i].yearLevel === $scope.subject.yearLevel) {
              $scope.yearLevelData.selectedOption = $scope.yearLevelData.availableOptions[i];
              break;
            }
          }
        }
        if ($scope.subject.year) {
          for (var j = 0; j < $scope.yearData.availableOptions.length; j++) {
            if ($scope.yearData.availableOptions[j].year === $scope.subject.year) {
              $scope.yearData.selectedOption = $scope.yearData.availableOptions[j];
              break;
            }
          }
        }
        if ($scope.subject.semester) {
          for (var x = 0; x < $scope.semesterData.availableOptions.length; x++) {
            if ($scope.semesterData.availableOptions[x].semester === $scope.subject.semester) {
              $scope.semesterData.selectedOption = $scope.semesterData.availableOptions[x];
              break;
            }
          }
        }
      });

    };


  }]);

  
  