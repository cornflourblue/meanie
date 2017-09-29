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
    // TODO: if admin user is logged in return all sites, otherwise return only user's sites
    siteService.getAll()
        .then(sites => res.send(sites))
        .catch(err => res.status(400).send(err));
}

function getById(req, res) {
    siteService.getById(req.params._id)
        .then(site => site ? res.send(site) : res.sendStatus(404))
        .catch(err => res.status(400).send(err));
}

function create(req, res) {
    siteService.create(req.body)
        .then((err) => {
            res.sendStatus(200)
        })
        .catch(err => {
            console.log('typeof(err)', typeof(err));
            console.log('err', err);
            return res.status(400).send(err);
        });
}

function update(req, res) {
    siteService.update(req.params._id, req.body)
        .then(()  => res.sendStatus(200))
        .catch(err => res.status(400).send(err));
}

function _delete(req, res) {
    siteService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(400).send(err));
}
