const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversation_id: { type: mongoose.Types.ObjectId, required: true },                 // Conversation's ID
    sender_id: { type: mongoose.Types.ObjectId, required: true },                       // Sender's ID
    content: { type: String, required: true },                                          // Message's content
    read: { type: Boolean, required: true }                                             // Whether message is read
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Message', MessageSchema);