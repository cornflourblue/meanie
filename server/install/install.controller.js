var express = require('express');
var router = express.Router();
var config = require('config.json');
var fs = require("fs");
var bcrypt = require('bcryptjs');
var db = require('api/helpers/db');

router.get('/', function (req, res) {
    if (config.installed) {
        return res.sendStatus(404);
    }

    return res.render('install/index');
});

router.post('/', function (req, res) {
    if (config.installed) {
        return res.sendStatus(404);
    }

    // create system admin user
    var user = new db.User(req.body);
    user.isSystemAdmin = true;

    // hash password
    if (req.body.password) {
        user.hash = bcrypt.hashSync(req.body.password, 10);
    }

    // save user
    user.save().then(function () {
        // create default site
        var site = new db.Site({
            name: 'Default Site',
            domains: [req.get('host')],
            createdBy: user._id,
            createdDate: Date.now()
        });

        // save site
        site.save().then(function () {
            // save installed flag in config file
            config.installed = true;
            fs.writeFileSync('./config.json', JSON.stringify(config));

            // return to login page with success message
            req.session.success = 'Installation successful, you can login now.';
            return res.redirect('/login');
        });
    })
    .catch(function (err) {
        return res.render('install/index', { error: err });
    });
});

module.exports = router;