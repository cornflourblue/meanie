var mongoose = require('mongoose');

var redirectSchema = {
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
};

module.exports = mongoose.model('Redirect', redirectSchema);