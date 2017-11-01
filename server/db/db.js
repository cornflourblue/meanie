var config = require('config.json');
var mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

var Site = require('./site');
var User = require('./user');
var Page = require('./page');

module.exports = {
    Site,
    User,
    Page
};