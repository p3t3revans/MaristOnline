'use strict';

// Configuring the years module
angular.module('years').run(['Menus',
  function (Menus) {
    // Add the years dropdown item
/*    Menus.addMenuItem('topbar', {
      title: 'Years',
      state: 'years',
      type: 'dropdown',
      roles: ['admin','teach']
    });*/

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'List Years',
      state: 'years.list',
      roles: ['admin','teach']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Year',
      state: 'years.create',
      roles: ['admin','teach']
    });
  }
]);
