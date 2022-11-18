const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
    sender_id: { type: mongoose.Types.ObjectId, required: true },                   // Sender's ID
    receiver_id: { type: mongoose.Types.ObjectId, required: true },                 // Receiver's ID
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);