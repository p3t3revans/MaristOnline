(function (app) {
    'use strict';
    app.registerModule('pictures', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('pictures.services');
    app.registerModule('pictures.routes', ['ui.router', 'pictures.services']);
}(ApplicationConfiguration));
