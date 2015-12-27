'use strict';

// Mediums controller
angular.module('mediums').controller('MediumsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mediums',
  function ($scope, $stateParams, $location, Authentication, Mediums) {
    $scope.authentication = Authentication;

    // Create new Medium
    $scope.create = function () {
      // Create new Medium object
      var medium = new Mediums({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      medium.$save(function (response) {
        $location.path('mediums/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Medium
    $scope.remove = function (medium) {
      if (medium) {
        medium.$remove();

        for (var i in $scope.mediums) {
          if ($scope.mediums[i] === medium) {
            $scope.mediums.splice(i, 1);
          }
        }
      } else {
        $scope.medium.$remove(function () {
          $location.path('mediums');
        });
      }
    };

    // Update existing Medium
    $scope.update = function () {
      var medium = $scope.medium;

      medium.$update(function () {
        $location.path('mediums/' + medium._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Mediums
    $scope.find = function () {
      $scope.mediums = Mediums.query();
    };

    // Find existing Medium
    $scope.findOne = function () {
      $scope.medium = Mediums.get({
        mediumId: $stateParams.mediumId
      });
    };
  }
]);
