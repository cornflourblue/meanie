var express = require('express');
var router = express.Router();
var config = require('config.json');
var installService = require('./install.service');

router.get('/', function (req, res) {
    if (config.installed) { return res.sendStatus(404); }

    return res.render('install/client/index');
});

router.post('/', function (req, res) {
    if (config.installed) { return res.sendStatus(404); }

    var user = req.body;
    installService.install(user, req.get('host'))
        .then(() => {
            // return to login page with success message
            req.session.success = 'Installation successful, you can login now.';
            return res.redirect('/login');
        })
        .catch(error => res.render('install/index', { error }));
});

module.exports = router;