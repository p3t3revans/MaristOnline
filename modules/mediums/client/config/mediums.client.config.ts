(function () {
  'use strict';

  angular
    .module('mediums')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Mediums',
      state: 'mediums',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'mediums', {
      title: 'List Mediums',
      state: 'mediums.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'mediums', {
      title: 'Create Medium',
      state: 'mediums.create',
      roles: ['admin','teach']
    });
  }
}());
