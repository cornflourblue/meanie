var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

router.get('/', function (req, res) {
    // log user out
    delete req.session.token;

    // move success message into local variable so it only appears once (single read)
    var viewData = { success: req.session.success };
    delete req.session.success;

    res.render('login/index', viewData);
});

router.post('/', function (req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            // authentication is successful if the token parameter has a value
            if (token) {
                // save JWT token in the session to make it available to the angular app
                req.session.token = token;

                // redirect to returnUrl
                var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/admin';
                return res.redirect(returnUrl);
            } else {
                return res.render('login/index', { error: 'Username or password is incorrect', username: req.body.username });
            }
        })
        .catch(function (err) {
            console.log('error on login', err);
            return res.render('login/index', { error: err });
        });
});

module.exports = router;