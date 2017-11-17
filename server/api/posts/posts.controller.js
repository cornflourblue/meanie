var config = require('config.json');
var _ = require('lodash');
var express = require('express');
var public = require('express-jwt')({ secret: config.secret, credentialsRequired: false });
var secure = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var PostService = require('./post.service');

// routes
router.get('/', public, getAll);
router.get('/:year/:month/:day/:slug', public, getByUrl);
router.get('/:_id', public, getById);
router.post('/', secure, create);
router.put('/:_id', secure, update);
router.delete('/:_id', secure, _delete);

module.exports = router;

function getAll(req, res, next) {
    var postService = new PostService(req.siteId);
    postService.getAll()
        .then(posts => {
            // if admin user is logged in return all posts, otherwise return only published posts
            req.user ? res.send(posts) : res.send(_.filter(posts, { 'publish': true }));
        })
        .catch(err => next(err));
}

function getByUrl(req, res, next) {
    var postService = new PostService(req.siteId);
    postService.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug)
        .then(post => {
            // return post if it's published or the admin is logged in
            if (post.publish || req.session.token) {
                res.send(post);
            } else {
                res.status(404).send('Not found');
            }
        })
        .catch(err => next(err));
    }

function getById(req, res, next) {
    var postService = new PostService(req.siteId);
    postService.getById(req.params._id)
        .then(post => res.send(post))
        .catch(err => next(err));
    }

function create(req, res, next) {
    var postService = new PostService(req.siteId);
    var post = req.body;
    post.site = req.siteId;
    post.createdBy = req.user.sub;
    postService.create(post)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    var postService = new PostService(req.siteId);
    postService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    var postService = new PostService(req.siteId);
    postService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}