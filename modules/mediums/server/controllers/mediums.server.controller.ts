'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Medium = mongoose.model('Medium'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an medium
 */
exports.create = function (req, res) {
  var medium = new Medium(req.body);
  medium.user = req.user;

  medium.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(medium);
    }
  });
};

/**
 * Show the current medium
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var medium = req.medium ? req.medium.toJSON() : {};

  // Add a custom field to the Medium, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Medium model.
  medium.isCurrentUserOwner = !!(req.user && medium.user && medium.user._id.toString() === req.user._id.toString());

  res.json(medium);
};

/**
 * Update an medium
 */
exports.update = function (req, res) {
  var medium = req.medium;

  medium.title = req.body.title;
  medium.content = req.body.content;

  medium.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(medium);
    }
  });
};

/**
 * Delete an medium
 */
exports.delete = function (req, res) {
  var medium = req.medium;

  medium.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(medium);
    }
  });
};

/**
 * List of Mediums
 */
exports.list = function (req, res) {
  Medium.find().sort('-created').populate('user', 'displayName').exec(function (err, mediums) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mediums);
    }
  });
};

/**
 * Medium middleware
 */
exports.mediumByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Medium is invalid'
    });
  }

  Medium.findById(id).populate('user', 'displayName').exec(function (err, medium) {
    if (err) {
      return next(err);
    } else if (!medium) {
      return res.status(404).send({
        message: 'No medium with that identifier has been found'
      });
    }
    req.medium = medium;
    next();
  });
};
