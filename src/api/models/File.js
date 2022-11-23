const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.FileSchema = new Schema({
    filename: { type: String },         // File's name in storage (example.png)
    url: { type: String }               // File's url in storage (/image/{post_id})
}, {
    _id: false,
    timestamp: false
});