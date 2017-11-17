var config = require('config.json');
var mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

var Site = require('../sites/site.model');
var User = require('../users/user.model');
var Post = require('../posts/post.model');
var Page = require('../pages/page.model');

module.exports = {
    Site,
    User,
    Post,
    Page
};