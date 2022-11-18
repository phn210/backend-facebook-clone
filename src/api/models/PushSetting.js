const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PushSettingSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },             // User's ID
    like_comment: { type: Boolean, default: true, required: true },         // Like/comment on post
    from_friends: { type: Boolean, default: true, required: true },         // Friends' new post/like/comment
    requested_friend: { type: Boolean, default: true, required: true },     // Friend request accepted
    suggested_friend: { type: Boolean, default: true, required: true },     // Friend request
    birthday: { type: Boolean, default: true, required: true },             // Friends' birthday
    video: { type: Boolean, default: true, required: true },                // Video finish uploading
    report: { type: Boolean, default: true, required: true },               // Reported post
    sound_on: { type: Boolean, default: true, required: true },             // Sound on notification
    notification_on: { type: Boolean, default: true, required: true },      // Allow notification
    vibrant_on: { type: Boolean, default: true, required: true },           // Vibrant on notification
    led_on: { type: Boolean, default: true, required: true }                // Led on notification
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('PushSetting', PushSettingSchema);