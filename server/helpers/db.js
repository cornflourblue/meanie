var config = require('config.json');
var mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

var Site = mongoose.model('Site', {
    name: { type: String, required: true },
    domains: [String],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

var User = mongoose.model('User', { 
    username: { type: String, required: true, unique: true },
    hash: String,
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

var Page = mongoose.model('Page', {
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true }, 
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    body: String,
    publish: Boolean,
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = {
    Site,
    User,
    Page
};