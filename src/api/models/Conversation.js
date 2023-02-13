const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    user1_id: { type: mongoose.Types.ObjectId, required: true },                 // User 1's ID
    user2_id: { type: mongoose.Types.ObjectId, required: true },                 // User 2's ID
    user1_nickname: { type: String, default: '' },                               // User 1's nickname
    user2_nickname: { type: String, default: '' },                               // User 2's nickname
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Conversation', ConversationSchema);