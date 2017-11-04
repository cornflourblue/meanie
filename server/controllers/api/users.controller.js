var config = require('config.json');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.get('/current', jwt, getCurrent);
router.get('/search', jwt, search);
router.get('/', jwt, getAll);
router.get('/:_id', jwt, getById);
router.post('/', jwt, create);
router.put('/:_id', jwt, update);
router.delete('/:_id', jwt, _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body.username, req.body.password)
        .then(token => token ? res.send({ token }) : res.status(401).send('Username or password is incorrect'))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function search(req, res, next) {
    userService.search(req.query.q)
        .then(users => res.send(users))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.send(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params._id)
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function create(req, res, next) {
    var user = req.body;
    user.createdBy = req.user.sub;
    userService.create(user)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params._id, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}