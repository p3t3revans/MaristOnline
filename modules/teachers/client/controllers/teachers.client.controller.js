(function () {
    'use strict';
    angular
        .module('teachers')
        .controller('TeachersController', TeachersController);
    TeachersController.$inject = ['$scope', '$state', 'teacherResolve', '$window', 'Authentication'];
    function TeachersController($scope, $state, teacher, $window, Authentication) {
        var vm = this;
        //
        vm.teacher = teacher;
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
        // Remove existing Teacher
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.teacher.$remove($state.go('teachers.list'));
            }
        }
        // Save Teacher
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.teacherForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.teacher._id) {
                vm.teacher.$update(successCallback, errorCallback);
            }
            else {
                vm.teacher.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('teachers.view', {
                    teacherId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
