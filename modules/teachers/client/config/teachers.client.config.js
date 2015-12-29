'use strict';

// Configuring the teachers module
angular.module('teachers').run(['Menus',
  function (Menus) {
    // Add the teachers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Teachers',
      state: 'teachers',
      type: 'dropdown',
      roles: ['admin','teach']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'List Teachers',
      state: 'teachers.list',
      roles: ['admin','teach']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Create Teacher',
      state: 'teachers.create',
      roles: ['admin','teach']
    });
  }
]);
