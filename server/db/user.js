var mongoose = require('mongoose');

var User = mongoose.model('User', {
    username: { type: String, required: true, unique: true },
    hash: String,
    sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = User;