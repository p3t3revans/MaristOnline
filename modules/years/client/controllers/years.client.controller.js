(function () {
    'use strict';
    angular
        .module('years')
        .controller('YearsController', YearsController);
    YearsController.$inject = ['$scope', '$state', 'yearResolve', '$window', 'Authentication'];
    function YearsController($scope, $state, year, $window, Authentication) {
        var vm = this;
        //
        vm.year = year;
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
        // Remove existing Year
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.year.$remove($state.go('years.list'));
            }
        }
        // Save Year
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.yearForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.year._id) {
                vm.year.$update(successCallback, errorCallback);
            }
            else {
                vm.year.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('years.view', {
                    yearId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
