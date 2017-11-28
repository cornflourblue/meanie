var express = require('express');
var router = express.Router();
var SiteService = require('./site.service');

// routes
router.get('/search', search);
router.get('/', getAll);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function search(req, res, next) {
    var siteService = new SiteService(req.user);
    siteService.search(req.query.q)
        .then(sites => res.send(sites))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    var siteService = new SiteService(req.user);
    siteService.getAll()
        .then(sites => res.send(sites))
        .catch(err => next(err));
}

function getById(req, res, next) {
    var siteService = new SiteService(req.user);
    siteService.getById(req.params._id)
        .then(site => site ? res.send(site) : res.sendStatus(404))
        .catch(err => next(err));
}

function create(req, res, next) {
    var siteService = new SiteService(req.user);
    siteService.create(req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    var siteService = new SiteService(req.user);
    siteService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    var siteService = new SiteService(req.user);
    siteService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}