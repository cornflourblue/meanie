var express = require('express');
var router = express.Router();
var config = require('config.json');
var jwt = require('express-jwt');
var UserService = require('./users/user.service');
var SiteService = require('./sites/site.service');

router.use(
    jwt({ secret: config.secret, credentialsRequired: false }),
    function(req, res, next) {
        if (req.user) {
            var userId = req.user.sub;
            var siteId = req.user.site;

            Promise.all(
                UserService.getById(userId).then(user => req.user = user),
                SiteService.getById(siteId).then(site => req.site = site)
            )
            .then(next);
        } else {
            next();
        }
    });

router.use('/sites', require('./sites/sites.controller'));
router.use('/users', require('./users/users.controller'));
router.use('/pages', require('./pages/pages.controller'));
router.use('/posts', require('./posts/posts.controller'));
router.use('/redirects', require('./redirects/redirects.controller'));
router.use('/contact', require('./contact/contact.controller'));

module.exports = router;