(function () {
  'use strict';

  angular
    .module('pictures')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Pictures',
      state: 'pictures',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'pictures', {
      title: 'List Pictures',
      state: 'pictures.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pictures', {
      title: 'Create Picture',
      state: 'pictures.create',
      roles: ['admin','teach']
    });
  }
}());
