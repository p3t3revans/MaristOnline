(function () {
    'use strict';
    angular
        .module('subjects')
        .controller('SubjectsListController', SubjectsListController);
    SubjectsListController.$inject = ['$scope', 'SubYears', 'SubjectsService', 'YearsService'];
    function SubjectsListController($scope, SubYears, SubjectsService, YearsService) {
        var vm = this;
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
        $scope.yearData = YearsService.query();
        $scope.yearData.$promise.then(function (result) {
            $scope.yearData = result;
            // setYearOption(yyyy);
        });
        $scope.semesterData = {
            availableOptions: [
                { semester: 1 },
                { semester: 2 }
            ],
            selectedOption: { semester: 1 } //This sets the default value of the select in the ui
        };
        $scope.listSubjects = function () {
            //    if ($scope.yearData.selectedOption.year & $scope.semesterData.selectedOption.semester) {
            $scope.yearSelect = $scope.yearData.selectedOption.year;
            $scope.semesterSelect = $scope.semesterData.selectedOption.semester;
            $scope.subjects = SubYears.query({ year: $scope.yearData.selectedOption.year, semester: $scope.semesterData.selectedOption.semester });
            $scope.subjects.$promise.then(function (response) {
                vm.wait = false;
                vm.subjects = response;
                if (response.count !== -1)
                    $scope.totalItems = response.count;
            });
            //   };
        };
        // vm.subjects = SubjectsService.query();
        //test
    }
}());
