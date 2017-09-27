var config = require('config.json');
var _ = require('lodash');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var siteService = require('services/site.service');

// routes
router.get('/', jwt, getAll);
router.get('/:_id', jwt, getById);
router.post('/', jwt, create);
router.put('/:_id', jwt, update);
router.delete('/:_id', jwt, _delete);

module.exports = router;

function getAll(req, res) {
    siteService.getAll()
        .then(function (sites) {
            // TODO: if admin user is logged in return all sites, otherwise return only user's sites
            res.send(sites);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    siteService.getById(req.params._id)
        .then(function (page) {
            res.send(page);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    siteService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    siteService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    siteService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}