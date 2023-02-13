const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocketSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },         // User' ID
    socket_id: { type: String, required: true },
}, {
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('Socket', SocketSchema);
