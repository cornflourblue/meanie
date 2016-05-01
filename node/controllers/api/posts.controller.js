var config = require('config.json');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var postService = require('services/post.service');

// routes
router.get('/', jwt, getAll);
router.get('/:_id', jwt, getById);
router.post('/', jwt, create);
router.put('/:_id', jwt, update);
router.delete('/:_id', jwt, _delete);

module.exports = router;

function getAll(req, res) {
    postService.getAll()
        .then(function (posts) {
            res.send(posts);
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