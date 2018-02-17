var express = require('express');
var router = express.Router();
var PageService = require('./page.service');

// routes
router.get('/', getAll);
router.get('/slug/:slug', getBySlug);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function getAll(req, res, next) {
    var pageService = new PageService(req.site, req.user);
    pageService.getAll()
        .then(pages => res.send(pages))
        .catch(err => next(err));
}

function getBySlug(req, res, next) {
    var pageService = new PageService(req.site, req.user);
    pageService.getBySlug(req.params.slug)
        .then(page => page ? res.send(page) : res.status(404).send('Not found'))
        .catch(err => next(err));
}

function getById(req, res, next) {
    var pageService = new PageService(req.site, req.user);
    pageService.getById(req.params._id)
        .then(page => page ? res.send(page) : res.status(404).send('Not found'))
        .catch(err => next(err));
}

function create(req, res, next) {
    var pageService = new PageService(req.site, req.user);
    pageService.create(req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    var pageService = new PageService(req.site, req.user);
    pageService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    var pageService = new PageService(req.site, req.user);
    pageService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}