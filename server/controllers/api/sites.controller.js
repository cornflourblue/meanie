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

function getAll(req, res, next) {
    // TODO: if admin user is logged in return all sites, otherwise return only user's sites
    siteService.getAll()
        .then(sites => res.send(sites))
        .catch(err => next(err));
}

function getById(req, res, next) {
    siteService.getById(req.params._id)
        .then(site => site ? res.send(site) : res.sendStatus(404))
        .catch(err => next(err));
}

function create(req, res, next) {
    siteService.create(req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    siteService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    siteService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}