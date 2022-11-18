const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SearchSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },         // User' ID
    keyword: { type: String, required: true },                          // Searched keyword
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Search', SearchSchema);