'use strict';

angular.module('artists')
  .controller('ArtistCtrl', [ '$scope','$stateParams', '$location', 'Artists', 'Authentication', function ($scope, $stateParams, $location, Artists, Authentication) {
    $scope.authentication = Authentication;
    var today = new Date();
    //var dd = today.getDate();
    //var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    // need to add these as mongo items as well
    $scope.year = {
      availableOptions: [
        { year: 2011 },
        { year: 2012 },
        { year: 2013 },
        { year: 2014 },
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
        yearEnrolled: $scope.year.selectedOption.year,
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
      artist.yearEnrolled = $scope.year.selectedOption.year;
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
          for (var j = 0; j < $scope.year.availableOptions.length; j++) {
            if ($scope.year.availableOptions[j].year === $scope.artist.yearEnrolled) {
              $scope.year.selectedOption = $scope.year.availableOptions[j];
              break;
            }
          }

        }
      });

    };
  }]);

  
  