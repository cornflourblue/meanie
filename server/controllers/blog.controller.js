var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var path = require('path');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var config = require('config.json');
var pageService = require('services/page.service');
var postService = require('services/post.service');
var redirectService = require('services/redirect.service');
var slugify = require('helpers/slugify');
var pager = require('helpers/pager');

var basePath = path.resolve('../client/blog');
var indexPath = basePath + '/index';
var metaTitleSuffix = " | MEANie - The MEAN Stack Blog";
var oneWeekSeconds = 60 * 60 * 24 * 7;
var oneWeekMilliseconds = oneWeekSeconds * 1000;

/* STATIC ROUTES
---------------------------------------*/

router.use('/_dist', express.static(basePath + '/_dist'));
router.use('/_content', express.static(basePath + '/_content', { maxAge: oneWeekMilliseconds }));

/* MIDDLEWARE
---------------------------------------*/

// check for redirects
router.use(function (req, res, next) {
    var host = req.get('host');
    var url = req.url.toLowerCase();

    // redirects entered into cms
    redirectService.getByFrom(url)
        .then(function (redirect) {
            if (redirect) {
                // 301 redirect to new url
                return res.redirect(301, redirect.to);
            } 

            next();
        })
        .catch(function (err) {
            vm.error = err;
            res.render(indexPath, vm);
        });
});

// add shared data to vm
router.use(function (req, res, next) {
    var vm = req.vm = {};

    vm.loggedIn = !!req.session.token;
    vm.domain = req.protocol + '://' + req.get('host');
    vm.url = vm.domain + req.path;
    vm.googleAnalyticsAccount = config.googleAnalyticsAccount;

    postService.getAll()
        .then(function (posts) {
            // if admin user is logged in return all posts, otherwise return only published posts
            vm.posts = vm.loggedIn ? posts : _.filter(posts, { 'publish': true });

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

// post by id route (permalink used by disqus comments plugin)
router.get('/post', function (req, res, next) {
    var vm = req.vm;

    if (!req.query.id) return res.status(404).send('Not found');

    // find by post id or disqus id (old post id)
    var post = _.find(vm.posts, function (p) {
        return p._id.toString() === req.query.id;
    });

    if (!post) return res.status(404).send('Not found');

    // 301 redirect to main post url
    var postUrl = '/post/' + moment(post.publishDate).format('YYYY/MM/DD') + '/' + post.slug;
    return res.redirect(301, postUrl);
});

// post details route
router.get('/post/:year/:month/:day/:slug', function (req, res, next) {
    var vm = req.vm;

    postService.getByUrl(req.params.year, req.params.month, req.params.day, req.params.slug)
        .then(function (post) {
            if (!post) return res.status(404).send('Not found');

            post.url = '/post/' + moment(post.publishDate).format('YYYY/MM/DD') + '/' + post.slug;
            post.publishDateFormatted = moment(post.publishDate).format('MMMM DD YYYY');
            post.permalink = vm.domain + '/post?id=' + post._id;
            vm.post = post;

            // add post tags and tag slugs to viewmodel
            vm.postTags = _.map(post.tags, function (tag) {
                return { text: tag, slug: slugify(tag) };
            });

            // meta tags
            vm.metaTitle = vm.post.title + metaTitleSuffix;
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
                vm.metaTitle = 'Posts tagged "' + vm.tag + '"' + metaTitleSuffix;
                vm.metaDescription = 'Posts tagged "' + vm.tag + '"' + metaTitleSuffix;
            }
        });

        return tagFound;
    });

    // redirect to home page if there are no posts with tag
    if (!vm.posts.length)
        return res.redirect(301, '/');

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
    vm.metaTitle = 'Posts for ' + vm.monthName + ' ' + vm.year + metaTitleSuffix;
    vm.metaDescription = 'Posts for ' + vm.monthName + ' ' + vm.year + metaTitleSuffix;

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
            vm.metaTitle = vm.page.title + metaTitleSuffix;
            vm.metaDescription = vm.page.description + metaTitleSuffix;

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
    vm.metaTitle = 'Archive' + metaTitleSuffix;
    vm.metaDescription = 'Archive' + metaTitleSuffix;

    render('archive/index.view.html', req, res);
});

// contact route
router.get('/contact', function (req, res, next) {
    var vm = req.vm;

    // meta tags
    vm.metaTitle = 'Contact Me' + metaTitleSuffix;
    vm.metaDescription = 'Contact Me' + metaTitleSuffix;

    render('contact/index.view.html', req, res);
});

// contact thanks route
router.get('/contact-thanks', function (req, res, next) {
    var vm = req.vm;

    // meta tags
    vm.metaTitle = 'Contact Me' + metaTitleSuffix;
    vm.metaDescription = 'Contact Me' + metaTitleSuffix;

    render('contact/thanks.view.html', req, res);
});

/* PROXY ROUTES
---------------------------------------*/

// google analytics
router.get('/analytics.js', function (req, res, next) {
    proxy('http://www.google-analytics.com/analytics.js', basePath + '/_content/analytics.js', req, res);
});

// carbon ads
router.get('/carbonads.js', function (req, res, next) {
    proxy('http://cdn.carbonads.com/carbon.js', basePath + '/_content/carbonads.js', req, res);
});

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

// proxy file from remote url for page speed score
function proxy(fileUrl, filePath, req, res) {
    // ensure file exists and is less than 1 hour old
    fs.stat(filePath, function (err, stats) {
        if (err) {
            // file doesn't exist so download and create it
            updateFileAndReturn();
        } else {
            // file exists so ensure it's not stale
            if (moment().diff(stats.mtime, 'minutes') > 60) {
                updateFileAndReturn();
            } else {
                returnFile();
            }
        }
    });

    // update file from remote url then send to client
    function updateFileAndReturn() {
        request(fileUrl, function (error, response, body) {
            fs.writeFileSync(filePath, body);
            returnFile();
        });
    }

    // send file to client
    function returnFile() {
        res.set('Cache-Control', 'public, max-age=' + oneWeekSeconds);
        res.sendFile(filePath);
    }
}