var express = require('express');
var router = express.Router();
var siteId = require('helpers/site-id');

router.use('/sites', require('./sites/sites.controller'));
router.use('/users', require('./users/users.controller'));
router.use('/pages', siteId, require('./pages/pages.controller'));
router.use('/posts', siteId, require('./posts/posts.controller'));
router.use('/redirects', siteId, require('./redirects/redirects.controller'));
router.use('/contact', siteId, require('./contact/contact.controller'));

module.exports = router;