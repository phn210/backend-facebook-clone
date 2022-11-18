const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },                 // User's ID
    post_id: { type: mongoose.Types.ObjectId, required: true },                 // Post's ID
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Like', LikeSchema);