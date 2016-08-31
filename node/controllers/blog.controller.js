var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var router = express.Router();
var postService = require('services/post.service');
var indexPath = path.resolve('../angular/blog/index');

// home route
router.get('/', function (req, res, next) {
    var vm = { templateUrl: 'home/index.view.server-side.html' };

    postService.getAll()
        .then(function (posts) {
            // if admin user is logged in return all posts, otherwise return only published posts
            vm.posts = req.session.token ? posts : _.filter(posts, { 'publish': true });

            // add urls to post objects for links in the view
            vm.posts.forEach(function (post) {
                post.url = '/posts/' + moment(post.publishDate).format('YYYY/MM/DD') + '/' + post.slug;
            });

            res.render(indexPath, vm);
        })
        .catch(function (err) {
            vm.error = err;

            res.render(indexPath, vm);
        });
});

// post details route
router.get('/posts/:year/:month/:day/:slug', function (req, res, next) {
    var vm = { templateUrl: 'posts/details.view.server-side.html' };

    postService.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug)
        .then(function (post) {
            if (!post) return res.status(404).send('Not found');

            vm.post = post;

            res.render(indexPath, vm);
        })
        .catch(function (err) {
            vm.error = err;

            res.render(indexPath, vm);
        });
});

// serve blog front end files from root path '/'
router.use('/', express.static('../angular/blog', { redirect: false }));

module.exports = router;