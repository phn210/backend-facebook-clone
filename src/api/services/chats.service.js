const mongoose = require('mongoose');

const ERROR = require('../controllers/responses/error');
const userService = require('../services/users.service');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Socket = require('../models/Socket');

async function createConversation({user_id, user_name, partner_id, partner_name}) {
    const conversation = new Conversation({
        user1_id: user_id,
        user2_id: partner_id,
        user1_nickname: user_name,
        user2_nickname: partner_name
    });

    await conversation.save();
    return conversation;
}

async function findConversation(user_id, partner_id) {
    return await Conversation.findOne({
        $or: [
            { $and: [{user1_id: user_id}, { user2_id: partner_id}] },
            { $and: [{user1_id: partner_id}, { user2_id: user_id}] }
        ]
    })
}

async function findConversationById(conversation_id) {
    return await Conversation.findById(mongoose.Types.ObjectId(conversation_id));
}

async function getConversationByPartner(partner_id) {}

async function getConversationById(conversation_id) {}

async function getConversation() {}

async function deleteConversation(conversation_id) {}

async function createMessage(conversation_id, sender_id, content) {
    const conversation = await findConversationById(conversation_id);
    if (!conversation) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    const message = new Message({
        conversation_id: conversation._id,
        sender_id: sender_id,
        content: content,
        read: false
    });

    await message.save();
    return message;
}

async function getMessage(conversation_id, message_id) {}

async function setReadMessage(conversation_id, message_id) {}

async function deleteMessage(conversation_id, message_id) {}

async function attachSocket(user_id, socket_id) {
    let socket = await Socket.findOne({ $and: [{user_id: user_id}, {socket_id: socket_id}] });
    
    if (socket) return socket._id;
    socket = new Socket({
        user_id: user_id,
        socket_id: socket_id
    });
    console.log('socket', socket);
    await socket.save();
    return socket._id;
}

async function detachSocket(socket_id) {
    await Socket.deleteMany({socket_id: socket_id});
}

async function findActiveSockets(user_id) {
    await Socket.find({user_id: user_id});
}

module.exports = {
    createConversation,
    findConversation,
    findConversationById,
    getConversationByPartner,
    getConversationById,
    getConversation,
    deleteConversation,
    createMessage,
    getMessage,
    setReadMessage,
    deleteMessage,
    attachSocket,
    detachSocket,
    findActiveSockets
}