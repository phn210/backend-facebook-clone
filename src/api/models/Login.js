const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoginSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },                                              // Latest login timestamp
    device_id: { type: mongoose.Types.ObjectId, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Login', LoginSchema);