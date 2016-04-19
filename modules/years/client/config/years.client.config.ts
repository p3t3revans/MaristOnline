(function () {
  'use strict';

  angular
    .module('years')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Years',
      state: 'years',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'years', {
      title: 'List Years',
      state: 'years.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'years', {
      title: 'Create Year',
      state: 'years.create',
      roles: ['admin','teach']
    });
  }
}());
