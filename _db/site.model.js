var mongoose = require('mongoose');

var siteSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    domains: [String],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Site', siteSchema);