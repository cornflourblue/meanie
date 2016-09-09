var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var router = express.Router();
var postService = require('services/post.service');
var pageService = require('services/page.service');

var basePath = path.resolve('../angular/blog');
var indexPath = basePath + '/index';

// base middleware function to add common viewmodel data
router.use(function (req, res, next) {
    var vm = req.vm = {};

    postService.getAll()
        .then(function (posts) {
            // if admin user is logged in return all posts, otherwise return only published posts
            vm.posts = req.session.token ? posts : _.filter(posts, { 'publish': true });

            // add urls to posts
            vm.posts.forEach(function (post) {
                post.url = '/post/' + moment(post.publishDate).format('YYYY/MM/DD') + '/' + post.slug;
                post.publishDateFormatted = moment(post.publishDate).format('MMMM DD YYYY');
            });
            
            loadYears();
            loadTags();

            next();
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });

    // load years and months for blog month list
    function loadYears() {
        vm.years = [];

        // get all publish dates
        var dates = _.pluck(vm.posts, 'publishDate');

        // loop through dates and create list of unique years and months
        _.each(dates, function (dateString) {
            var date = moment(dateString);

            var year = _.findWhere(vm.years, { value: date.format('YYYY') });
            if (!year) {
                year = { value: date.format('YYYY'), months: [] };
                vm.years.push(year);
            }

            var month = _.findWhere(year.months, { value: date.format('MM') });
            if (!month) {
                month = { value: date.format('MM'), name: moment(date).format('MMMM'), postCount: 1 };
                year.months.push(month);
            } else {
                month.postCount += 1;
            }
        });
    }

    function loadTags() {
        // get unique array of all tags
        vm.tags = _.chain(vm.posts)
            .pluck('tags')
            .flatten()
            .uniq()
            .sort()
            .filter(function (el) { return el; }) // remove undefined/null values
            .map(function (tag) {
                return { text: tag, slug: slugify(tag) };
            })
            .value();
    }
});

// home route
router.get('/', function (req, res, next) {
    var vm = req.vm;

    vm.templateUrl = 'home/index.view.html';

    // render view only for ajax request or whole page for full request
    var renderPath = req.xhr ? basePath + '/' + vm.templateUrl : indexPath;
    return res.render(renderPath, vm);
});

// post details route
router.get('/post/:year/:month/:day/:slug', function (req, res, next) {
    var vm = req.vm;

    vm.templateUrl = 'posts/details.view.html';

    postService.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug)
        .then(function (post) {
            if (!post) return res.status(404).send('Not found');

            vm.post = post;

            // render view only for ajax request or whole page for full request
            var renderPath = req.xhr ? basePath + '/' + vm.templateUrl : indexPath;
            return res.render(renderPath, vm);
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });
});

// posts for tag route
router.get('/posts/tag/:tag', function (req, res, next) {
    var vm = req.vm;

    vm.templateUrl = 'posts/tag.view.html';

    // filter posts by specified tag
    vm.posts = _.filter(vm.posts, function (post) {
        if (!post.tags)
            return false;

        // loop through tags to find a match
        var tagFound = false;
        _.each(post.tags, function (tag) {
            var tagSlug = slugify(tag);
            if (tagSlug === req.params.tag) {
                // set vm.tag and title here to get the un-slugified version for display
                vm.tag = tag;
                tagFound = true;
            }
        });

        return tagFound;
    });

    // render view only for ajax request or whole page for full request
    var renderPath = req.xhr ? basePath + '/' + vm.templateUrl : indexPath;
    return res.render(renderPath, vm);
});

// posts for month route
router.get('/posts/:year/:month', function (req, res, next) {
    var vm = req.vm;

    vm.templateUrl = 'posts/month.view.html';
    vm.year = req.params.year;
    vm.monthName = moment(req.params.year + req.params.month + '01').format('MMMM');

    // filter posts by specified year and month
    vm.posts = _.filter(vm.posts, function (post) {
        return moment(post.publishDate).format('YYYYMM') === req.params.year + req.params.month;
    });

    // render view only for ajax request or whole page for full request
    var renderPath = req.xhr ? basePath + '/' + vm.templateUrl : indexPath;
    return res.render(renderPath, vm);
});

// page details route
router.get('/page/:slug', function (req, res, next) {
    var vm = req.vm;

    vm.templateUrl = 'pages/details.view.html';

    pageService.getBySlug(req.params.slug)
        .then(function (page) {
            if (!page) return res.status(404).send('Not found');

            vm.page = page;

            // render view only for ajax request or whole page for full request
            var renderPath = req.xhr ? basePath + '/' + vm.templateUrl : indexPath;
            return res.render(renderPath, vm);
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });
});

// serve blog front end files from root path '/'
router.use('/', express.static('../angular/blog'));

module.exports = router;

// private helper functions

function slugify(input) {
    if (!input)
        return;

    // make lower case and trim
    var slug = input.toLowerCase().trim();

    // replace invalid chars with spaces
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ');

    // replace multiple spaces or hyphens with a single hyphen
    slug = slug.replace(/[\s-]+/g, '-');

    return slug;
};
