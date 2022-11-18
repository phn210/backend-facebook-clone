const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    post_id: { type: mongoose.Types.ObjectId, required: true },                         // Post's ID
    reporter_id: { type: mongoose.Types.ObjectId, required: true },                     // Report user's ID
    subject: { type: String, required: true },                                          // Report's subject
    details: { type: String, required: true }                                           // Report's details
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Report', ReportSchema);