const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SUPPORTED_NOTIFICATIONS = [
    'LIKE',
    'COMMENT',
    'FRIEND_LIKE',
    'FRIEND_COMMENT',
    'FRIEND_POST',
    'FRIEND_REQUEST',
    'FRIEND_ACCEPTED',
    'FRIEND_SUGGESTED',
    'REPORT',
    'LOGIN'
]

const NotificationSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },                         // User's ID
    type: { type: String, enum: SUPPORTED_NOTIFICATIONS, required: true },              // Notification type
    read: { type: Boolean, default: false, required: true },                            // Whether the notification is read
    related_id: { type: mongoose.Types.ObjectId, required: true },                      // Related subject's ID (user, post, etc.)
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Notification', NotificationSchema);