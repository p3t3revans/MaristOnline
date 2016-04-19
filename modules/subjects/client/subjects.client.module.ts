(function (app) {
  'use strict';

  app.registerModule('subjects', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('subjects.services');
  app.registerModule('subjects.routes', ['ui.router', 'subjects.services']);
}(ApplicationConfiguration));
