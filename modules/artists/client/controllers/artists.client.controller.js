'use strict';

angular.module('artists')
  .controller('ArtistCtrl', ['$scope', '$timeout', '$stateParams', '$location', 'Artists', 'Authentication', function ($scope, $timeout, $stateParams, $location, Artists, Authentication) {
    $scope.authentication = Authentication;
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
      ],
      selectedOption: { year: yyyy } //This sets the default value of the select in the ui
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
      ],
      selectedOption: { semester: 1 } //This sets the default value of the select in the ui
    };



    $scope.create = function () {
      // Create new Artist object
      var artist = new Artists({
        title: $scope.artist.title,
        description: $scope.artist.description,
        yearLevel: $scope.yearLevelData.selectedOption.yearLevel,
        year: $scope.yearData.selectedOption.year,
        semester: $scope.semesterData.selectedOption.semester,
        teacher: $scope.artist.teacher
      });

      // Redirect after save
      artist.$save(function (response) {
        $location.path('artists/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
        $scope.teacher = '';
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
      artist.yearLevel = $scope.yearLevelData.selectedOption.yearLevel;
      artist.semester = $scope.semesterData.selectedOption.semester;
      artist.year = $scope.yearData.selectedOption.year;

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
        if ($scope.artist.yearLevel) {
          var l = $scope.yearLevelData.availableOptions.length;
          for (var i = 0; i < l; i++) {
            if ($scope.yearLevelData.availableOptions[i].yearLevel === $scope.artist.yearLevel) {
              $scope.yearLevelData.selectedOption = $scope.yearLevelData.availableOptions[i];
              break;
            }
          }
        }
         if ($scope.artist.year) {
           for (var j = 0; j < $scope.yearData.availableOptions.length; j++) {
             if ($scope.yearData.availableOptions[j].year === $scope.artist.year) {
               $scope.yearData.selectedOption = $scope.yearData.availableOptions[j];
               break;
             }
           }
         }
         if ($scope.artist.semester) {
           for (var x = 0; x < $scope.semesterData.availableOptions.length; x++) {
             if ($scope.semesterData.availableOptions[x].semester === $scope.artist.semester) {
               $scope.semesterData.selectedOption = $scope.semesterData.availableOptions[x];
               break;
             }
           }
         }
      });     
 
    };


  }]);

  
  