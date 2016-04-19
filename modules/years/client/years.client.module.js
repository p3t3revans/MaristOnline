(function (app) {
    'use strict';
    app.registerModule('years', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('years.services');
    app.registerModule('years.routes', ['ui.router', 'years.services']);
}(ApplicationConfiguration));
