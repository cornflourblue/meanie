var mongoose = require('mongoose');

var postSchema = {
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    title: { type: String, required: [true, 'Title is required'] },
    slug: { type: String, required: [true, 'Slug is required'] },
    summary: String,
    body: String,
    tags: [String],
    publishDate: { type: Date, required: [true, 'Publish Date is required'] },
    publish: Boolean,
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
};

module.exports = mongoose.model('Post', postSchema);