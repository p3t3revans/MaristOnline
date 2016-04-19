(function (app) {
    'use strict';
    app.registerModule('artists', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('artists.services');
    app.registerModule('artists.routes', ['ui.router', 'artists.services']);
}(ApplicationConfiguration));
