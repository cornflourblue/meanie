var express = require('express');
var router = express.Router();
var RedirectService = require('./redirect.service');

// routes
router.get('/', getAll);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function getAll(req, res, next) {
    var redirectService = new RedirectService(req.site, req.user);
    redirectService.getAll()
        .then(redirects => res.send(redirects))
        .catch(err => next(err));
}

function getById(req, res, next) {
    var redirectService = new RedirectService(req.site, req.user);
    redirectService.getById(req.params._id)
        .then(redirect => redirect ? res.send(redirect) : res.status(404).send('Not found'))
        .catch(err => next(err));
}

function create(req, res, next) {
    var redirectService = new RedirectService(req.site, req.user);
    redirectService.create(req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    var redirectService = new RedirectService(req.site, req.user);
    redirectService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    var redirectService = new RedirectService(req.site, req.user);
    redirectService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}