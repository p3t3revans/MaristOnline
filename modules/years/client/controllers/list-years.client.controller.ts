(function () {
  'use strict';

  angular
    .module('years')
    .controller('YearsListController', YearsListController);

  YearsListController.$inject = ['YearsService'];

  function YearsListController(YearsService) {
    var vm = this;

    vm.years = YearsService.query();
  }
}());
