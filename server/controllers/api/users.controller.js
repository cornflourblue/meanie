var config = require('config.json');
var express = require('express');
var jwt = require('express-jwt')({ secret: config.secret });
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticate);
router.get('/current', jwt, getCurrent);
router.get('/:_id', jwt, getById);
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

function getById(req, res, next) {
    userService.getById(req.params._id)
        .then(user => user ? res.send(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId, req.body)
        .then(() => res.sendStatus(200))
        .catch(err => next(err));
}