var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hash: String,
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

userSchema.virtual('sites', {
    ref: 'Site',
    localField: '_id',
    foreignField: 'users'
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);