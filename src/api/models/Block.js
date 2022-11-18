const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockSchema = new Schema({
    blocker_id: { type: mongoose.Types.ObjectId, required: true },                      // Block user's ID
    victim_id: { type: mongoose.Types.ObjectId, required: true },                       // Blocked user's ID
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Block', BlockSchema);