(function () {
  'use strict';

  angular
    .module('subjects')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Subjects',
      state: 'subjects',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'subjects', {
      title: 'List Subjects',
      state: 'subjects.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'subjects', {
      title: 'Create Subject',
      state: 'subjects.create',
      roles: ['admin','teach']
    });
  }
}());
