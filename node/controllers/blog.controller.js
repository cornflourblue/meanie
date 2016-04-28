var express = require('express');
var path = require('path');
var router = express.Router();

// serve blog front end files from root path '/'
router.use('/', express.static('../angular/blog', { redirect: false }));

// rewrite virtual urls to angular app to enable refreshing of internal pages
router.get('*', function (req, res, next) {
    res.sendFile(path.resolve('../angular/blog/index.html'));
});

module.exports = router;