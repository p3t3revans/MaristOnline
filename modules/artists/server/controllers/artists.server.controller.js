'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Artist = mongoose.model('Artist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a artist
 */
exports.create = function (req, res) {
  var artist = new Artist(req.body);
  //artist.user = req.user;

  artist.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(artist);
    }
  });
};

/**
 * Show the current artist
 */
exports.read = function (req, res) {
  res.json(req.artist);
};

/**
 * Update a artist
 */
exports.update = function (req, res) {
  var artist = req.artist;
  artist.name = req.body.name;
  artist.description = req.body.description;
  artist.yearEnrolled = req.body.yearEnrolled;
  artist.house = req.body.house;
  artist.active = req.body.active;
  artist.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
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
    } else {
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
    } else {
      res.json(artists);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Artist.find().sort('-year').exec(function (err, artists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
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

  Artist.findById(id).exec(function (err, artist) {
    if (err) {
      return next(err);
    } else if (!artist) {
      return res.status(404).send({
        message: 'No artist with that identifier has been found'
      });
    }
    req.artist = artist;
    next();
  });
};
