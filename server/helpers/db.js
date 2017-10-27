var config = require('config.json');
var mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

var Site = mongoose.model('Site', { 
    subdomain: String 
});

var User = mongoose.model('User', { 
    username: { type: String, required: true },
    hash: String
});

var Page = mongoose.model('Page', {
    siteId: { type: String, required: true }, 
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    body: String,
    publish: Boolean
});

module.exports = {
    Site,
    User,
    Page
};