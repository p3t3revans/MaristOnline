'use strict';

// Configuring the Artists module
angular.module('artists').run(['Menus',
  function (Menus) {
    // Add the artists dropdown item
   Menus.addMenuItem('topbar', {
      title: 'Artists',
      state: 'artists',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'artists', {
      title: 'List Artists',
      state: 'artists.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'artists', {
      title: 'Create Artists',
      state: 'artists.create',
      roles: ['admin','teach']
    });
  }
]);
