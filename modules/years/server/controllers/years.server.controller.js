'use strict';
/**
 * Module dependencies
 */
var path = require('path'), mongoose = require('mongoose'), Year = mongoose.model('Year'), errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/**
 * Create an year
 */
exports.create = function (req, res) {
    var year = new Year(req.body);
    year.user = req.user;
    year.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(year);
        }
    });
};
/**
 * Show the current year
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var year = req.year ? req.year.toJSON() : {};
    // Add a custom field to the Year, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Year model.
    year.isCurrentUserOwner = !!(req.user && year.user && year.user._id.toString() === req.user._id.toString());
    res.json(year);
};
/**
 * Update an year
 */
exports.update = function (req, res) {
    var year = req.year;
    year.year = req.body.year;
    year.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
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
        }
        else {
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
        }
        else {
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
        }
        else if (!year) {
            return res.status(404).send({
                message: 'No year with that identifier has been found'
            });
        }
        req.year = year;
        next();
    });
};
