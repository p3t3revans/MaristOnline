'use strict';

// Years controller
angular.module('years').controller('YearsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Years',
  function ($scope, $stateParams, $location, Authentication, Years) {
    $scope.authentication = Authentication;

    // Create new Year
    $scope.create = function () {
      // Create new Year object
      var year = new Years({
        year: this.year
      });

      // Redirect after save
      year.$save(function (response) {
        $location.path('years/' + response._id);

        // Clear form fields
        $scope.year = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Year
    $scope.remove = function (year) {
      if (year) {
        year.$remove();

        for (var i in $scope.years) {
          if ($scope.years[i] === year) {
            $scope.years.splice(i, 1);
          }
        }
      } else {
        $scope.year.$remove(function () {
          $location.path('years');
        });
      }
    };

    // Update existing Year
    $scope.update = function () {
      var year = $scope.year;

      year.$update(function () {
        $location.path('years/' + year._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Years
    $scope.find = function () {
      $scope.years = Years.query();
    };

    // Find existing Year
    $scope.findOne = function () {
      $scope.year = Years.get({
        yearId: $stateParams.yearId
      });
    };
  }
]);
