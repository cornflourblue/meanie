var express = require('express');
var router = express.Router();
var fs = require("fs");
var userService = require('services/user.service');

router.get('/', function (req, res) {
    userService.getAll().then(function (users) {
        if (!users || users.length == 0) {
            res.render('install/index');
        } else {
            res.sendStatus(401);
        }
    });
});

router.post('/', function (req, res) {

    userService.getAll().then(function (users) {
        if (users && users.length != 0) {
            res.sendStatus(401);
        } else {
            userService.create(req.body).then(function () {
                // return to login page with success message
                req.session.success = 'Installation successful, you can login now.';
                res.redirect('/login');
            })
            .catch(function (err) {
                res.render('install/index', { error: err });
            });;
        }
    });
});

module.exports = router;