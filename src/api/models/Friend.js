const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    user1_id: { type: mongoose.Types.ObjectId, required: true },                 // User 1's ID
    user2_id: { type: mongoose.Types.ObjectId, required: true },                 // User 2's ID
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Friend', FriendSchema);