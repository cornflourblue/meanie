var mongoose = require('mongoose');

var pageSchema = {
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    body: String,
    publish: Boolean,
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
};

module.exports = mongoose.model('Page', pageSchema);