var express = require('express');
var router = express.Router();

// use session auth to secure the front end admin files
router.use('/', function (req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/admin' + req.path));
    }

    next();
});

// serve admin front end files from '/admin'
router.use('/', express.static('../angular/admin'));

module.exports = router;