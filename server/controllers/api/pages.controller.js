var config = require('config.json');
var _ = require('lodash');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var pageService = require('services/page.service');

// routes
router.get('/', getAll);
router.get('/slug/:slug', getBySlug);
router.get('/:_id', jwt, getById);
router.post('/', jwt, create);
router.put('/:_id', jwt, update);
router.delete('/:_id', jwt, _delete);

module.exports = router;

function getAll(req, res) {
    pageService.getAll()
        .then(function (pages) {
            // if admin user is logged in return all pages, otherwise return only published pages
            if (req.session.token) {
                res.send(pages);
            } else {
                res.send(_.filter(pages, { 'publish': true }));
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getBySlug(req, res) {
    pageService.getBySlug(req.params.slug)
        .then(function (page) {
            // return page if it's published or the admin is logged in
            if (page.publish || req.session.token) {
                res.send(page);
            } else {
                res.status(404).send('Not found');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    pageService.getById(req.params._id)
        .then(function (page) {
            res.send(page);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function create(req, res) {
    pageService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    pageService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    pageService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}