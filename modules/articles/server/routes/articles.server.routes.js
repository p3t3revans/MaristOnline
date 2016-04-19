'use strict';
/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'), articles = require('../controllers/articles.server.controller');
module.exports = function (app) {
    // Articles collection routes
    app.route('/api/articles').all(articlesPolicy.isAllowed)
        .get(articles.list)
        .post(articles.create);
    app.route('/api/articles/page/:page/count/:count').all(articlesPolicy.isAllowed)
        .get(articles.list);
    // Articles collection routes
    app.route('/api/articlesfp').all(articlesPolicy.isAllowed)
        .get(articles.listfp);
    // Articles collection routes
    app.route('/api/articleslead').all(articlesPolicy.isAllowed)
        .get(articles.getLeadArticle);
    // Single article routes
    app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
        .get(articles.read)
        .put(articles.update)
        .delete(articles.delete);
    // Finish by binding the article middleware
    app.param('articleId', articles.articleByID);
};
