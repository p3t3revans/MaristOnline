'use strict';

/**
 * Module dependencies
 */
var mediumsPolicy = require('../policies/mediums.server.policy'),
  mediums = require('../controllers/mediums.server.controller');

module.exports = function (app) {
  // Mediums collection routes
  app.route('/api/mediums').all(mediumsPolicy.isAllowed)
    .get(mediums.list)
    .post(mediums.create);

  // Single medium routes
  app.route('/api/mediums/:mediumId').all(mediumsPolicy.isAllowed)
    .get(mediums.read)
    .put(mediums.update)
    .delete(mediums.delete);

  // Finish by binding the medium middleware
  app.param('mediumId', mediums.mediumByID);
};
