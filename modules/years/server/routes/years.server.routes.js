'use strict';
/**
 * Module dependencies
 */
var yearsPolicy = require('../policies/years.server.policy'), years = require('../controllers/years.server.controller');
module.exports = function (app) {
    // Years collection routes
    app.route('/api/years').all(yearsPolicy.isAllowed)
        .get(years.list)
        .post(years.create);
    // Single year routes
    app.route('/api/years/:yearId').all(yearsPolicy.isAllowed)
        .get(years.read)
        .put(years.update)
        .delete(years.delete);
    // Finish by binding the year middleware
    app.param('yearId', years.yearByID);
};
