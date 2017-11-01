var mongoose = require('mongoose');

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

module.exports = Page;