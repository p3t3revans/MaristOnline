(function (app) {
  'use strict';

  app.registerModule('mediums', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('mediums.services');
  app.registerModule('mediums.routes', ['ui.router', 'mediums.services']);
}(ApplicationConfiguration));
