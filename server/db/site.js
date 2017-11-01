var mongoose = require('mongoose');
var User = require('./user');

var siteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domains: [String],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

siteSchema.pre('save', function (next) {
    console.log('saving site', this._id);

    // save site to referenced users

    next();
});

siteSchema.pre('update', function (next) {
    console.log('updating site', this);
    next();
});

var Site = mongoose.model('Site', siteSchema);

module.exports = Site;