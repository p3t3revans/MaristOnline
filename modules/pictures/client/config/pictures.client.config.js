'use strict';

// Configuring the Pictures module
angular.module('pictures').run(['Menus',
  function (Menus) {
    // Add the pictures dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Pictures',
      state: 'pictures',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'pictures', {
      title: 'List Pictures',
      state: 'pictures.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'pictures', {
      title: 'Create Pictures',
      state: 'pictures.create',
      roles: ['admin','teach']
    });
  }
]);
