'use strict';
/**
 * Module dependencies
 */
var path = require('path'), mongoose = require('mongoose'), Artist = mongoose.model('Artist'), errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * Create an artist
 */
exports.create = function (req, res) {
    var artist = new Artist(req.body);
    artist.user = req.user;
    artist.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(artist);
        }
    });
};
/**
 * Show the current artist
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var artist = req.artist ? req.artist.toJSON() : {};
    // Add a custom field to the Artist, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Artist model.
    artist.isCurrentUserOwner = !!(req.user && artist.user && artist.user._id.toString() === req.user._id.toString());
    res.json(artist);
};
/**
 * Update an artist
 */
exports.update = function (req, res) {
    var artist = req.artist;
    artist.name = req.body.name;
    artist.description = req.body.description;
    artist.house = req.body.house;
    artist.active = req.body.active;
    artist.yearEnrolled = req.body.yearEnrolled;
    artist.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(artist);
        }
    });
};
/**
 * Delete an artist
 */
exports.delete = function (req, res) {
    var artist = req.artist;
    artist.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(artist);
        }
    });
};
/**
 * List of Artists by year enrolled
 */
exports.listactiveyear = function (req, res) {
    Artist.find({ yearEnrolled: req.params.yearEnrolled, active: true }).exec(function (err, artists) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(artists);
        }
    });
};
/**
 * List of Artists
 */
exports.list = function (req, res) {
    Artist.find().sort('-created').populate('user', 'displayName').exec(function (err, artists) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(artists);
        }
    });
};
/**
 * Artist middleware
 */
exports.artistByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Artist is invalid'
        });
    }
    Artist.findById(id).populate('user', 'displayName').exec(function (err, artist) {
        if (err) {
            return next(err);
        }
        else if (!artist) {
            return res.status(404).send({
                message: 'No artist with that identifier has been found'
            });
        }
        req.artist = artist;
        next();
    });
};
