'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Subject = mongoose.model('Subject'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a subject
 */

exports.create = function (req, res) {
    var subject = new Subject(req.body);
    //subject.user = req.user;
   // for (var i = 0; i < req.body.artists.length; i++) {
    //    subject.artists.push(req.body.artists[i]);
  // }
    //subject.artists = req.body.artists;
    subject.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(subject);
        }
    });
};

/**
 * Show the current subject
 */
exports.read = function (req, res) {
    res.json(req.subject);
};

/**
 * Update a subject
 */
exports.update = function (req, res) {
    var subject = req.subject;
    subject.title = req.body.title;
    subject.description = req.body.description;
    subject.year = req.body.year;
    subject.yearLevel = req.body.yearLevel;
    subject.semester = req.body.semester;
    subject.teacher = req.body.teacher;
    subject.artists = req.body.artists;
    subject.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(subject);
        }
    });
};

/**
 * Delete an subject
 */
exports.delete = function (req, res) {
    var subject = req.subject;

    subject.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(subject);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
    Subject.find().sort('-year').exec(function (err, subjects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(subjects);
        }
    });
};
 
 
/**
* List of Subjects for a year
*/
exports.listyearsemester = function (req, res) {
    Subject.find({ year: req.params.year, semester: req.params.semester })
        .exec(function (err, subjects) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(subjects);
            }
        });
};
exports.listsemester = function (req, res) {
    Subject.find({ semester: req.params.semester })
        .exec(function (err, subjects) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(subjects);
            }
        });
};
exports.listyear = function (req, res) {
    Subject.find({ year: req.params.year })
        .exec(function (err, subjects) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(subjects);
            }
        });
};
/**
 * Subject middleware
 */
exports.subjectByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Subject is invalid'
        });
    }

    Subject.findById(id).exec(function (err, subject) {
        if (err) {
            return next(err);
        } else if (!subject) {
            return res.status(404).send({
                message: 'No subject with that identifier has been found'
            });
        }
        req.subject = subject;
        next();
    });
};
