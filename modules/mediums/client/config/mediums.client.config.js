'use strict';

// Configuring the Mediums module
angular.module('mediums').run(['Menus',
  function (Menus) {
    // Add the mediums dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Mediums',
      state: 'mediums',
      type: 'dropdown',
      roles: ['admin','teach']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'mediums', {
      title: 'List Mediums',
      state: 'mediums.list',
      roles: ['admin','teach']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'mediums', {
      title: 'Create Mediums',
      state: 'mediums.create',
      roles: ['admin','teach']
    });
  }
]);
