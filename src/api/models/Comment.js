const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    post_id: { type: mongoose.Types.ObjectId, required: true },                         // Post's ID
    author_id: { type: mongoose.Types.ObjectId, required: true },                       // Comment user's ID
    comment: { type: String, default: 0, required: true },                              // Comment's content
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Comment', CommentSchema);