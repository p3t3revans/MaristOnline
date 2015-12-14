'use strict';

angular.module('pictures')
  .controller('PictureCtrl', ['Artists', 'Subjects', '$rootScope', '$scope', '$stateParams', '$location', 'Pictures', 'Authentication', function (Artists, Subjects, $rootScope, $scope, $stateParams, $location, Pictures, Authentication) {
    $scope.authentication = Authentication;
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
        { name: 'Work on Paper' },
        { name: 'Sulpture' },
        { name: 'Work on Canvas' },
        { name: 'Photograph' },
        { name: 'Clay' }
      ],
      selectedOption: { name: 'Work on Paper' } //This sets the default value of the select in the ui
    };
    $scope.load = function () {
      $scope.subjects = Subjects.query();
      $scope.subjects.$promise.then(function (result) {
        $scope.dataSubject = result;
      });
      $scope.artists = Artists.query();
      $scope.artists.$promise.then(function(result){
        $scope.dataArtist = result;
      });
    };
    $scope.addPicture = function (element) {
      if (element.files && element.files[0]) {
        var FR = new FileReader();
        FR.onload = function (e) {
          // $('#img').attr("src", e.target.result);// what is this might not need to do the folloeing step
          // $('#base').text(e.target.result);
          //$scope.picture.picture = e.target.result.toString('base64');
          $scope.picture.picture = e.target.result;
          var i = 1;
          i++;
          //fileNameS = element.files[0].name;
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
      picture.year = $scope.yearData.selectedOption.year;
      picture.medium = $scope.data.selectedOption.medium;
      picture.subject = $scope.dataSubject.selectedOption._id;
      picture.$update(function () {
        $location.path('pictures/' + picture._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Pictures
    $scope.find = function () {
      $scope.pictures = Pictures.query();
    };

    // Find existing Picture
    $scope.findOne = function () {
      $scope.picture = Pictures.get({
        pictureId: $stateParams.pictureId
      });
      $scope.picture.$promise.then(function () {
        if ($scope.picture.yearLevel) {
          var l = $scope.yearLevelData.availableOptions.length;
          for (var i = 0; i < l; i++) {
            if ($scope.yearLevelData.availableOptions[i].yearLevel === $scope.picture.yearLevel) {
              $scope.yearLevelData.selectedOption = $scope.yearLevelData.availableOptions[i];
              break;
            }
          }
        }
        if ($scope.picture.year) {
          for (var j = 0; j < $scope.yearData.availableOptions.length; j++) {
            if ($scope.yearData.availableOptions[j].year === $scope.picture.year) {
              $scope.yearData.selectedOption = $scope.yearData.availableOptions[j];
              break;
            }
          }
        }
        if ($scope.picture.semester) {
          for (var x = 0; x < $scope.semesterData.availableOptions.length; x++) {
            if ($scope.semesterData.availableOptions[x].semester === $scope.picture.semester) {
              $scope.semesterData.selectedOption = $scope.semesterData.availableOptions[x];
              break;
            }
          }
        }
      });

    };


  }]);

  
  