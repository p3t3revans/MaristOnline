'use strict';

angular.module('pictures')
  .controller('PictureCtrl', ['Years', 'Artists', 'Subjects', '$rootScope', '$scope', '$stateParams', '$location', 'Pictures', 'Authentication', function (Years, Artists, Subjects, $rootScope, $scope, $stateParams, $location, Pictures, Authentication) {
    $scope.authentication = Authentication;
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
    $scope.yearSelect = yyyy;
    $scope.semesterSelect = 1;

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

    $scope.data = {
      availableOptions: [
        { medium: 'Work on Paper' },
        { medium: 'Sulpture' },
        { medium: 'Work on Canvas' },
        { medium: 'Photograph' },
        { medium: 'Clay' }
      ],
      selectedOption: { name: 'Work on Paper' } //This sets the default value of the select in the ui
    };
        $scope.semesterData = {
      availableOptions: [
        { semester: 1 },
        { semester: 2 }
      ],
      selectedOption: { semester: 1 } //This sets the default value of the select in the ui
    };
    $scope.load = function () {
      $scope.yearSelect = $scope.yearData.selectedOption.year;
      $scope.semesterSelect = $scope.semesterData.selectedOption.semester;
      $scope.subjects = Years.query({ year: $scope.yearSelect, semester: $scope.semesterSelect });
      $scope.subjects.$promise.then(function (result) {
        $scope.dataSubject = result;
      });
      $scope.artists = Artists.query();
      $scope.artists.$promise.then(function (result) {
        $scope.dataArtist = result;
      });
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
        medium: $scope.data.selectedOption.medium,
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
      picture.medium = $scope.data.selectedOption.medium;
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
      $scope.pictures.$promise.then(function(){
          
      })
    };

    // Find existing Picture
    $scope.findOne = function () {
      $scope.picture = Pictures.get({
        pictureId: $stateParams.pictureId
      });
      $scope.picture.$promise.then(function () {
        if ($scope.picture.medium) {
          for (var x = 0; x < $scope.data.availableOptions.length; x++) {
            if ($scope.data.availableOptions[x].medium === $scope.picture.medium) {
              $scope.data.selectedOption = $scope.data.availableOptions[x];
              break;
            }
          }
        }
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
          }
        });
        $scope.artists = Artists.query();
        $scope.artists.$promise.then(function (result) {
          $scope.dataArtist = result;
          if ($scope.picture.artist) {
            for (var j = 0; j < $scope.dataArtist.length; j++) {
              if ($scope.dataArtist[j]._id === $scope.picture.artist) {
                $scope.dataArtist.selectedOption = $scope.dataArtist[j];
                break;
              }
            }
          }
        });
      });
    };
  }]);

  
  