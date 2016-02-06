'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
    function (Menus) {
        // Add the articles dropdown item
        Menus.addMenuItem('topbar', {
            title: 'Teacher Functions',
            state: 'articles',
            type: 'dropdown',
            roles: ['admin','teach']
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'articles', {
            title: 'List Articles',
            state: 'articles.list',
            roles: ['admin','teach']
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'articles', {
            title: 'Create Articles',
            state: 'articles.create',
            roles: ['admin','teach']
        });
    }
]);
