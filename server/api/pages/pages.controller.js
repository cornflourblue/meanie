var config = require('config.json');
var _ = require('lodash');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var pageService = require('./page.service');

// routes
router.get('/', getAll);
router.get('/slug/:slug', getBySlug);
router.get('/:_id', jwt, getById);
router.post('/', jwt, create);
router.put('/:_id', jwt, update);
router.delete('/:_id', jwt, _delete);

module.exports = router;

function getAll(req, res, next) {
    pageService.getAll()
        .then(pages => {
            // if admin user is logged in return all pages, otherwise return only published pages
            if (req.session.token) {
                res.send(pages);
            } else {
                res.send(_.filter(pages, { 'publish': true }));
            }
        })
        .catch(err => next(err));
    }

function getBySlug(req, res, next) {
    pageService.getBySlug(req.params.slug)
        .then(page => {
            // return page if it's published or the admin is logged in
            if (page.publish || req.session.token) {
                res.send(page);
            } else {
                res.status(404).send('Not found');
            }
        })
        .catch(err => next(err));
    }

function getById(req, res, next) {
    pageService.getById(req.params._id)
        .then(page => res.send(page))
        .catch(err => next(err));
    }

function create(req, res, next) {
    pageService.create(req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    pageService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    pageService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}