'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
    var article = new Article(req.body);
    article.user = req.user;

    article.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
    res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
    var article = req.article;

    article.title = req.body.title;
    article.content = req.body.content;

    article.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
    var article = req.article;
    article.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
    Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Article is invalid'
        });
    }

    Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
        if (err) {
            return next(err);
        } else if (!article) {
            return res.status(404).send({
                message: 'No article with that identifier has been found'
            });
        }
        req.article = article;
        next();
    });
};

/*
* Paginate List front page
 **/
exports.listfp = function (req, res) {
    Article.find().where({ displayFrontPage: true }).exec(function (err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({ articles: articles });
        }
    });
    /* var page = 1;
     var per_page = 10;
     var pictureCount = 0;
     if (req.params.page > 1) {
         page = req.params.page;
         pictureCount = -1;
     }
     else {
         Picture.find().where({ 'frontPage': true }).count(function (err, count) {
             if (err) {
                 return res.status(400).send({
                     message: errorHandler.getErrorMessage(err)
                 });
             } else {
                 pictureCount = Math.ceil(count / per_page);
             }
         })
     }
 
 
 
     Picture.find().where({ frontPage: true }).sort('-year').skip((page - 1) * per_page).limit(per_page).exec(function (err, pictures) {
         if (err) {
             return res.status(400).send({
                 message: errorHandler.getErrorMessage(err)
             });
         } else {
             res.json({ pictures: pictures, count: pictureCount });
         }
     });*/

};

/*
* Paginate List front page
 **/
exports.getLeadArticle = function (req, res) {
    Article.find().where({ leadArticle: true }).exec(function (err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({ articles: articles });
        }
    });
    /* var page = 1;
     var per_page = 10;
     var pictureCount = 0;
     if (req.params.page > 1) {
         page = req.params.page;
         pictureCount = -1;
     }
     else {
         Picture.find().where({ 'frontPage': true }).count(function (err, count) {
             if (err) {
                 return res.status(400).send({
                     message: errorHandler.getErrorMessage(err)
                 });
             } else {
                 pictureCount = Math.ceil(count / per_page);
             }
         })
     }
 
 
 
     Picture.find().where({ frontPage: true }).sort('-year').skip((page - 1) * per_page).limit(per_page).exec(function (err, pictures) {
         if (err) {
             return res.status(400).send({
                 message: errorHandler.getErrorMessage(err)
             });
         } else {
             res.json({ pictures: pictures, count: pictureCount });
         }
     });*/

};