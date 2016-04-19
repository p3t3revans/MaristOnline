'use strict';
/**
 * Module dependencies
 */
var artistsPolicy = require('../policies/artists.server.policy'), artists = require('../controllers/artists.server.controller');
module.exports = function (app) {
    // Artists collection routes
    app.route('/api/artists').all(artistsPolicy.isAllowed)
        .get(artists.list)
        .post(artists.create);
    // Single artist routes
    app.route('/api/artists/:artistId').all(artistsPolicy.isAllowed)
        .get(artists.read)
        .put(artists.update)
        .delete(artists.delete);
    //active artists 
    app.route('/api/artistsyearenrolled/:yearEnrolled').all(artistsPolicy.isAllowed)
        .get(artists.listactiveyear);
    // Finish by binding the artist middleware
    app.param('artistId', artists.artistByID);
};
