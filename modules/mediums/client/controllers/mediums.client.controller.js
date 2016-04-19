(function () {
    'use strict';
    angular
        .module('mediums')
        .controller('MediumsController', MediumsController);
    MediumsController.$inject = ['$scope', '$state', 'mediumResolve', '$window', 'Authentication'];
    function MediumsController($scope, $state, medium, $window, Authentication) {
        var vm = this;
        //
        vm.medium = medium;
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
        // Remove existing Medium
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.medium.$remove($state.go('mediums.list'));
            }
        }
        // Save Medium
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.mediumForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.medium._id) {
                vm.medium.$update(successCallback, errorCallback);
            }
            else {
                vm.medium.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('mediums.view', {
                    mediumId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
