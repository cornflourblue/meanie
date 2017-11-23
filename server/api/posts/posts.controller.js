var express = require('express');
var router = express.Router();
var PostService = require('./post.service');

// routes
router.get('/', getAll);
router.get('/:year/:month/:day/:slug', getByUrl);
router.get('/:_id', getById);
router.post('/', create);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

function getAll(req, res, next) {
    var postService = new PostService(req.site, req.user);
    postService.getAll()
        .then(posts => res.send(posts))
        .catch(err => next(err));
}

function getByUrl(req, res, next) {
    var postService = new PostService(req.site, req.user);
    postService.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug)
        .then(post => post ? res.send(post) : res.status(404).send('Not found'))
        .catch(err => next(err));
    }

function getById(req, res, next) {
    var postService = new PostService(req.site, req.user);
    postService.getById(req.params._id)
        .then(post => post ? res.send(post) : res.status(404).send('Not found'))
        .catch(err => next(err));
    }

function create(req, res, next) {
    var postService = new PostService(req.site, req.user);
    postService.create(req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    var postService = new PostService(req.site, req.user);
    postService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    var postService = new PostService(req.site, req.user);
    postService.delete(req.params._id)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}