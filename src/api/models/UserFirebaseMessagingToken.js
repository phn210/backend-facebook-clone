const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFirebaseMessagingTokenSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },         // User' ID
    token: { type: String, required: true },
}, {
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('UserFirebaseMessagingToken', UserFirebaseMessagingTokenSchema);
