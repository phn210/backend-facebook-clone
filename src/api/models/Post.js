const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { FileSchema } = require('./File');

const PostSchema = new Schema({
    author: { type: mongoose.Types.ObjectId, required: true },                          // Author user's ID
    content: { type: String, required: true },                                        // Post's content
    image: { type: [FileSchema] },                                                      // Post's uploaded images
    video: { type: FileSchema },                                                        // Post's uploaded video
    modified: { type: Number, default: 0, required: true },                             // Number of modification
    is_deleted: { type: Boolean, default: false, required: true }                       // Whether post is deleted
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Post', PostSchema);