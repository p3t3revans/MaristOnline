(function () {
    'use strict';
    angular
        .module('articles')
        .controller('ArticlesController', ArticlesController);
    ArticlesController.$inject = ['$timeout', '$scope', '$state', 'articleResolve', '$window', 'Authentication', 'FileUploader'];
    function ArticlesController($timeout, $scope, $state, article, $window, Authentication, FileUploader) {
        var vm = this;
        vm.article = article;
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
        // Remove existing Article
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.article.$remove($state.go('articles.list'));
            }
        }
        // Save Article
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
                return false;
            }
            // TODO: move create/update logic to service
            if (vm.article._id) {
                vm.article.$update(successCallback, errorCallback);
            }
            else {
                vm.article.$save(successCallback, errorCallback);
            }
            function successCallback(res) {
                $state.go('articles.view', {
                    articleId: res._id
                });
            }
            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
        vm.cancelUpload = cancelUpload;
        // Create file uploader instance
        vm.uploader = new FileUploader({
            url: 'api/users/picture',
            alias: 'newProfilePicture',
            onAfterAddingFile: onAfterAddingFile,
            onSuccessItem: onSuccessItem,
            onErrorItem: onErrorItem
        });
        // Set file uploader image filter
        vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // Called after the user selected a new picture file
        function onAfterAddingFile(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fre) {
                    $timeout(function () {
                        var sizePicture = Math.ceil(fre.target.result.length / 1400);
                        if (sizePicture > 100)
                            alert('Picture size is ' + sizePicture + ' KBs Max size is 100 KBs');
                        else
                            vm.article.picture = fre.target.result;
                    }, 0);
                };
            }
        }
        // Called after the user has successfully uploaded a new picture
        function onSuccessItem(fileItem, response, status, headers) {
            // Show success message
            vm.success = true;
            // Populate user object
            vm.user = Authentication.user = response;
            // Clear upload buttons
            cancelUpload();
        }
        // Called after the user has failed to uploaded a new picture
        function onErrorItem(fileItem, response, status, headers) {
            // Clear upload buttons
            cancelUpload();
            // Show error message
            vm.error = response.message;
        }
        // Change user profile picture
        function uploadProfilePicture() {
            // Clear messages
            vm.success = vm.error = null;
            // Start upload
            vm.uploader.uploadAll();
        }
        // Cancel the upload process
        function cancelUpload() {
            vm.uploader.clearQueue();
            vm.imageURL = vm.user.profileImageURL;
        }
    }
}());
