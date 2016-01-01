'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Picture = mongoose.model('Picture'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a picture
 */
exports.create = function (req, res) {
    var picture = new Picture(req.body);
    //picture.user = req.user;

    picture.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(picture);
        }
    });
};

/**
 * Show the current picture
 */
exports.read = function (req, res) {
    res.json(req.picture);
};

/** 
 * Update a picture
 */
exports.update = function (req, res) {
    var picture = req.picture;
    picture.title = req.body.title;
    picture.artistName = req.body.artistName;
    picture.year = req.body.year;
    picture.artist = req.body.artist;
    picture.medium = req.body.medium;
    picture.picture = req.body.picture;
    picture.subject = req.body.subject;
    picture.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(picture);
        }
    });
};

/**
 * Delete an picture
 */
exports.delete = function (req, res) {
    var picture = req.picture;

    picture.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(picture);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {

    Picture.find().sort('-year').exec(function (err, pictures) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pictures);
        }
    });
};

/**
 * Picture middleware
 */
exports.pictureByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Picture is invalid'
        });
    }

    Picture.findById(id).exec(function (err, picture) {
        if (err) {
            return next(err);
        } else if (!picture) {
            return res.status(404).send({
                message: 'No picture with that identifier has been found'
            });
        }
        req.picture = picture;
        next();
    });

};
/*
* Paginate List articles
 **/
exports.picturesList = function (req, res) {
    var page = 1;
    var pictureCount = 0;
    if (req.params.page > 1) {
        page = req.params.page;
        pictureCount = -1;
    }
    else {
        Picture.distinct("_id", function (err, result) {

            if (err) {
                next(err);
            } else {
                pictureCount = result.length;
            }
        });
    }
    var per_page = 1;


    Picture.find().sort('-year').skip((page - 1) * per_page).limit(per_page).exec(function (err, pictures) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({ pictures: pictures, count: pictureCount });
        }
    });

};
/*
* Paginate List count
 **/
exports.picturesCount = function (req, res) {
    // Picture.aggregate([
    //        {
    //           $group: {
    //               _id: '$_id', 
    //               count: {$sum: 1}
    //           }
    //       }
    //    ], function (err, result) {
    //       if (err) {
    //           next(err);
    //      } else {
    //          res.json(result);
    //      }
    //  });
    Picture.distinct("_id", function (err, result) {

        if (err) {
            next(err);
        } else {
            res.json({ result: result, count: result.length });
        }
    });
};
