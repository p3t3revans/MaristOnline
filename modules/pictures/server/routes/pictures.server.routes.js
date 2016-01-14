'use strict';

/**
 * Module dependencies.
 */
var picturesPolicy = require('../policies/pictures.server.policy'),
    pictures = require('../controllers/pictures.server.controller');

module.exports = function (app) {
    // pictures collection routes
    app.route('/api/pictures').all(picturesPolicy.isAllowed)
        .get(pictures.list)
        .post(pictures.create);
    
    // pictures collection routes
    app.route('/api/picturespage/:page').all(picturesPolicy.isAllowed)
        .get(pictures.picturesList);
 
    // pictures front page routes
    app.route('/api/picturesfrontpage/:page').all(picturesPolicy.isAllowed)
        .get(pictures.picturesFrontPageList);


    // pictures front page routes
    app.route('/api/picturesbyartist/:artistId/page/:page').all(picturesPolicy.isAllowed)
        .get(pictures.picturesByArtistList);
         
    // pictures front page routes
    app.route('/api/picturesbyyear/:year/page/:page').all(picturesPolicy.isAllowed)
        .get(pictures.picturesByYearList);
                
    // pictures count routes
    app.route('/api/picturescount/').all(picturesPolicy.isAllowed)
        .get(pictures.picturesCount);
           
    // Single picture routes
    app.route('/api/pictures/:pictureId').all(picturesPolicy.isAllowed)
        .get(pictures.read)
        .put(pictures.update)
        .delete(pictures.delete);

    // Finish by binding the picture middleware
    app.param('pictureId', pictures.pictureByID);
};
