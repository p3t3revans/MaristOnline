(function () {
    'use strict';
    angular
        .module('mediums')
        .controller('MediumsListController', MediumsListController);
    MediumsListController.$inject = ['MediumsService'];
    function MediumsListController(MediumsService) {
        var vm = this;
        vm.mediums = MediumsService.query();
    }
}());
