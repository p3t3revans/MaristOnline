'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Picture = mongoose.model('Picture'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an picture
 */
exports.create = function(req, res) {
    var picture = new Picture(req.body);
    picture.user = req.user;

    picture.save(function(err) {
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
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var picture = req.picture ? req.picture.toJSON() : {};

    // Add a custom field to the Picture, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Picture model.
    picture.isCurrentUserOwner = !!(req.user && picture.user && picture.user._id.toString() === req.user._id.toString());

    res.json(picture);
};

/**
 * Update an picture
 */
exports.update = function(req, res) {
    var picture = req.picture;

    picture.title = req.body.title;
    picture.content = req.body.content;
    picture.artistName = req.body.artistName;
    picture.year = req.body.year;
    picture.artist = req.body.artist;
    picture.medium = req.body.medium;
    picture.picture = req.body.picture;
    picture.subject = req.body.subject;
    picture.frontPage = req.body.frontPage;
    picture.year = req.body.year;
    picture.yearLevel = req.body.yearLevel;
    picture.semester = req.body.semester;
    picture.teacher = req.body.teacher;
    picture.subjectName = req.body.subjectName;
    picture.save(function(err) {
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
exports.delete = function(req, res) {
    var picture = req.picture;

    picture.remove(function(err) {
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
 * List of Pictures
 */
exports.list = function(req, res) {
    Picture.find().sort('-created').populate('user', 'displayName').exec(function(err, pictures) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pictures);
        }
    });
};
/*
* for the list stuff by Peter
*/
/*
* Paginate List articles
 **/
exports.picturesList = function(req, res) {
    var page = 1;
    var per_page = 5;
    var pictureCount = 0;
    if (req.params.page > 1) {
        page = req.params.page;
        pictureCount = -1;
    }
    else {
        Picture.find().count(function(err, count) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                //pictureCount = Math.ceil(count / per_page);
                pictureCount = count;
            }
        })
    }



    Picture.find().sort('-year').skip((page - 1) * per_page).limit(per_page).exec(function(err, pictures) {
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
exports.picturesCount = function(req, res) {
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
    Picture.distinct("_id", function(err, result) {

        if (err) {
            // next(err);
        } else {
            res.json({ result: result, count: result.length });
        }
    });
};

/*
* Paginate List front page
 **/
exports.picturesFrontPageList = function(req, res) {
    var page = 1;
    var per_page = 5;
    var pictureCount = 0;
    if (req.params.page > 1) {
        page = req.params.page;
        pictureCount = -1;
    }
    else {
        Picture.find().where({ 'frontPage': true }).count(function(err, count) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                //pictureCount = Math.ceil(count / per_page);
                pictureCount = count;
            }
        })
    }



    Picture.find().where({ frontPage: true }).sort('-year').skip((page - 1) * per_page).limit(per_page).exec(function(err, pictures) {
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
* Paginate List pictures by artist
 **/
exports.picturesByArtistList = function(req, res) {
    var page = 1;
    var per_page = 5;
    var pictureCount = req.params.count;
    if (req.params.page > 1) {
        page = req.params.page;
        //pictureCount = -1;
    }
    else if (pictureCount == 0) {
        Picture.find().where({ 'artist': req.params.artistId }).count(function(err, count) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                //pictureCount = Math.ceil(count / per_page);
                pictureCount = count;
            }
        })
    }



    Picture.find().where({ 'artist': req.params.artistId }).sort('-year').skip((page - 1) * per_page).limit(per_page).exec(function(err, pictures) {
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
* Paginate List pictures by artist
 **/
exports.picturesByYearList = function(req, res) {
    var page = 1;
    var per_page = 5;
    var pictureCount = req.params.count;
    if (req.params.page > 1) {
        page = req.params.page;
        //pictureCount = -1;
    }
    else if (pictureCount == 0) {
        Picture.find().where({ 'year': req.params.year }).count(function(err, count) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                //pictureCount = Math.ceil(count / per_page);
                pictureCount = count;
            }
        })
    }



    Picture.find().where({ 'year': req.params.year }).skip((page - 1) * per_page).limit(per_page).exec(function(err, pictures) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({ pictures: pictures, count: pictureCount });
        }
    });

};

/**
 * Picture middleware
 */
exports.pictureByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Picture is invalid'
        });
    }

    Picture.findById(id).populate('user', 'displayName').exec(function(err, picture) {
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
