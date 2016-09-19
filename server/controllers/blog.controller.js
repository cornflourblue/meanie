var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var router = express.Router();
var config = require('config.json');
var pageService = require('services/page.service');
var postService = require('services/post.service');
var redirectService = require('services/redirect.service');
var slugify = require('helpers/slugify');
var pager = require('helpers/pager');

var basePath = path.resolve('../client/blog');
var indexPath = basePath + '/index';

/* MIDDLEWARE
---------------------------------------*/

// check for redirects
router.use(function (req, res, next) {
    redirectService.getByFrom(req.url.toLowerCase())
        .then(function (redirect) {
            if (redirect) {
                // 301 redirect to new url
                res.redirect(301, redirect.to);
            } else {
                // continue
                next();
            }
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });
});

// add posts, years and tags to vm
router.use(function (req, res, next) {
    var vm = req.vm = {};

    // site title
    vm.siteTitle = config.siteTitle;

    // default meta title
    vm.metaTitle = config.siteTitle;

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

/* ROUTES
---------------------------------------*/

// home route
router.get('/', function (req, res, next) {
    var vm = req.vm;

    var currentPage = req.query.page || 1;
    vm.pager = pager(vm.posts.length, currentPage);
    vm.posts = vm.posts.slice(vm.pager.startIndex, vm.pager.endIndex + 1);

    render('home/index.view.html', req, res);
});

// post details route
router.get('/post/:year/:month/:day/:slug', function (req, res, next) {
    var vm = req.vm;

    postService.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug)
        .then(function (post) {
            if (!post) return res.status(404).send('Not found');

            post.url = '/post/' + moment(post.publishDate).format('YYYY/MM/DD') + '/' + post.slug;
            post.publishDateFormatted = moment(post.publishDate).format('MMMM DD YYYY');
            vm.post = post;

            // add tags and tag slugs to viewmodel
            vm.tags = _.map(post.tags, function (tag) {
                return { text: tag, slug: slugify(tag) };
            });

            // meta tags
            vm.metaTitle = vm.post.title + ' | ' + config.siteTitle;
            vm.metaDescription = vm.post.summary;

            render('posts/details.view.html', req, res);
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });
});

// posts for tag route
router.get('/posts/tag/:tag', function (req, res, next) {
    var vm = req.vm;

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

                // meta tags
                vm.metaTitle = 'Posts tagged "' + vm.tag + '"' + ' | ' + config.siteTitle;
                vm.metaDescription = 'Posts tagged "' + vm.tag + '"' + ' | ' + config.siteTitle;
            }
        });

        return tagFound;
    });

    render('posts/tag.view.html', req, res);
});

// posts for month route
router.get('/posts/:year/:month', function (req, res, next) {
    var vm = req.vm;

    vm.year = req.params.year;
    vm.monthName = moment(req.params.year + req.params.month + '01').format('MMMM');

    // filter posts by specified year and month
    vm.posts = _.filter(vm.posts, function (post) {
        return moment(post.publishDate).format('YYYYMM') === req.params.year + req.params.month;
    });

    // meta tags
    vm.metaTitle = 'Posts for ' + vm.monthName + ' ' + vm.year + ' | ' + config.siteTitle;
    vm.metaDescription = 'Posts for ' + vm.monthName + ' ' + vm.year + ' | ' + config.siteTitle;

    render('posts/month.view.html', req, res);
});

// page details route
router.get('/page/:slug', function (req, res, next) {
    var vm = req.vm;

    pageService.getBySlug(req.params.slug)
        .then(function (page) {
            if (!page) return res.status(404).send('Not found');

            vm.page = page;

            // meta tags
            vm.metaTitle = vm.page.title + ' | ' + config.siteTitle;
            vm.metaDescription = vm.page.description + ' | ' + config.siteTitle;

            render('pages/details.view.html', req, res);
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });
});

// archive route
router.get('/archive', function (req, res, next) {
    var vm = req.vm;

    // meta tags
    vm.metaTitle = 'Archive' + ' | ' + config.siteTitle;
    vm.metaDescription = 'Archive' + ' | ' + config.siteTitle;

    render('archive/index.view.html', req, res);
});

// contact route
router.get('/contact', function (req, res, next) {
    var vm = req.vm;

    // meta tags
    vm.metaTitle = 'Contact Me' + ' | ' + config.siteTitle;
    vm.metaDescription = 'Contact Me' + ' | ' + config.siteTitle;

    render('contact/index.view.html', req, res);
});

// contact thanks route
router.get('/contact-thanks', function (req, res, next) {
    var vm = req.vm;

    // meta tags
    vm.metaTitle = 'Contact Me' + ' | ' + config.siteTitle;
    vm.metaDescription = 'Contact Me' + ' | ' + config.siteTitle;

    render('contact/thanks.view.html', req, res);
});

// static routes
router.use('/_dist', express.static('../client/blog/_dist'));
router.use('/_content', express.static('../client/blog/_content'));

module.exports = router;

/* PRIVATE HELPER FUNCTIONS
---------------------------------------*/

// render template
function render(templateUrl, req, res) {
    var vm = req.vm;

    vm.xhr = req.xhr;
    vm.templateUrl = templateUrl;

    // render view only for ajax request or whole page for full request
    var renderPath = req.xhr ? basePath + '/' + vm.templateUrl : indexPath;
    return res.render(renderPath, vm);
}