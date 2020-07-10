var config = require('config.json');
var _ = require('lodash');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var redirectService = require('services/redirect.service');

// routes
router.get('/', jwt, getAll);
router.get('/:_id', jwt, getById);
router.post('/', jwt, create);
router.put('/:_id', jwt, update);
router.delete('/:_id', jwt, _delete);

module.exports = router;

function getAll(req, res) {
    redirectService.getAll()
        .then(function (redirects) {
            res.send(redirects);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    redirectService.getById(req.params._id)
        .then(function (redirect) {
            res.send(redirect);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    redirectService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    redirectService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    redirectService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}