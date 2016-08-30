var config = require('config.json');
var _ = require('lodash');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var postService = require('services/post.service');

// routes
router.get('/', getAll);
router.get('/:year/:month/:day/:slug', getByUrl);
router.get('/:_id', jwt, getById);
router.post('/', jwt, create);
router.put('/:_id', jwt, update);
router.delete('/:_id', jwt, _delete);

module.exports = router;

function getAll(req, res) {
    postService.getAll()
        .then(function (posts) {
            // if admin user is logged in return all posts, otherwise return only published posts
            if (req.session.token) {
                res.send(posts);
            } else {
                res.send(_.filter(posts, { 'publish': true }));
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByUrl(req, res) {
    postService.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug)
        .then(function (post) {
            // return post if it's published or the admin is logged in
            if (post.publish || req.session.token) {
                res.send(post);
            } else {
                res.status(404).send('Not found');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    postService.getById(req.params._id)
        .then(function (post) {
            res.send(post);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    postService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    postService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    postService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}