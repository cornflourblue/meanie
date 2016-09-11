var express = require('express');
var router = express.Router();
var config = require('config.json');
var fs = require("fs");
var userService = require('services/user.service');

router.get('/', function (req, res) {
    if (config.installed) {
        return res.sendStatus(401);
    }

    return res.render('install/index');
});

router.post('/', function (req, res) {
    if (config.installed) {
        return res.sendStatus(401);
    }

    // create user
    userService.create(req.body)
        .then(function () {
            // save installed flag in config file
            config.installed = true;
            fs.writeFileSync('./config.json', JSON.stringify(config));

            // return to login page with success message
            req.session.success = 'Installation successful, you can login now.';
            return res.redirect('/login');
        })
        .catch(function (err) {
            return res.render('install/index', { error: err });
        });
});

module.exports = router;