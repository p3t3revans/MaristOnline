(function (app) {
    'use strict';
    app.registerModule('teachers', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('teachers.services');
    app.registerModule('teachers.routes', ['ui.router', 'teachers.services']);
}(ApplicationConfiguration));
