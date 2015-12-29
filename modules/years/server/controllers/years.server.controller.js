'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Year = mongoose.model('Year'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a year
 */
exports.create = function (req, res) {
  var year = new Year(req.body);
  year.user = req.user;

  year.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(year);
    }
  });
};

/**
 * Show the current year
 */
exports.read = function (req, res) {
  res.json(req.year);
};

/**
 * Update a year
 */
exports.update = function (req, res) {
  var year = req.year;

  year.year = req.body.year;

  year.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(year);
    }
  });
};

/**
 * Delete an year
 */
exports.delete = function (req, res) {
  var year = req.year;

  year.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(year);
    }
  });
};

/**
 * List of Years
 */
exports.list = function (req, res) {
  Year.find().sort('-created').populate('user', 'displayName').exec(function (err, years) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(years);
    }
  });
};

/**
 * Year middleware
 */
exports.yearByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Year is invalid'
    });
  }

  Year.findById(id).populate('user', 'displayName').exec(function (err, year) {
    if (err) {
      return next(err);
    } else if (!year) {
      return res.status(404).send({
        message: 'No year with that identifier has been found'
      });
    }
    req.year = year;
    next();
  });
};
