var express = require('express');
var router = express.Router();
var config = require('config.json');
var jwt = require('express-jwt')({ secret: config.secret, credentialsRequired: false });
var db = require('_db/db');

router.use(
    jwt,
    attachRequestData
);

router.use('/sites', require('./sites/sites.controller'));
router.use('/users', require('./users/users.controller'));
router.use('/pages', require('./pages/pages.controller'));
router.use('/posts', require('./posts/posts.controller'));
router.use('/redirects', require('./redirects/redirects.controller'));
router.use('/contact', require('./contact/contact.controller'));

module.exports = router;

function attachRequestData(req, res, next) {
    // attach current user and site to request
    var userId = req.user && req.user.sub;
    var siteId = req.get('MEANie-Site-Id');

    Promise.all([
        db.User.findById(userId).then(user => req.user = user),
        db.Site.findById(siteId).then(site => req.site = site)
    ])
    .then(() => next())
    .catch(err => console.log(err));
}