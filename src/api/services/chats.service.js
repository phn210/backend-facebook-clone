const mongoose = require('mongoose');

const ERROR = require('../controllers/responses/error');
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

async function getConversataion(partner_id, user_id) {
    const conversation = await Conversation.findOne({
        $or: [
            {
                user1_id: mongoose.Types.ObjectId(partner_id),
                user2_id: mongoose.Types.ObjectId(user_id),
            },
            {
                user1_id: mongoose.Types.ObjectId(user_id),
                user2_id: mongoose.Types.ObjectId(partner_id),
            },
        ],
    });

    if (!conversation) throw ERROR.PARAMETER_VALUE_IS_INVALID;
    return conversation;
}

async function getConversationByPartner(
    partner_id,
    user_id,
    index = 0,
    count = 20
) {
    const conversation = await getConversataion(partner_id, user_id);
    const messages = await Message.find({ conversation_id: conversation._id })
        .sort("-created_at")
        .skip(index * count)
        .limit(count);

    return {
        messages: messages,
        conversation: conversation,
    };
}

async function getConversationById(conversation_id, index = 0, count = 20) {
    const conversation = await Conversation.findById(
        mongoose.Types.ObjectId(conversation_id)
    );

    if (!conversation) throw ERROR.PARAMETER_VALUE_IS_INVALID;

    const messages = await Message.find({ conversation_id: conversation._id })
        .sort("-created_at")
        .skip(index * count)
        .limit(count);

    return {
        messages: messages,
        conversation: conversation,
    };
}

async function getListConversation(user_id, index = 0, count = 20) {
    const conversations = await Conversation.find({
        $or: [
            {
                user2_id: mongoose.Types.ObjectId(user_id),
            },
            {
                user1_id: mongoose.Types.ObjectId(user_id),
            },
        ],
    })
        .sort("-updated_at")
        .skip(index * count)
        .limit(count);

    if (!conversations) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    return conversations;
}

async function deleteConversation(conversation_id) {
    const conversation = await Conversation.findById(
        mongoose.Types.ObjectId(conversation_id)
    );
    if (!conversation) throw ERROR.PARAMETER_VALUE_IS_INVALID;
    conversation.remove();
}

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

async function setReadMessage(conversation_id) {
    const messages = await Message.find({
        conversation_id: conversation_id,
        read: false,
    });

    if (!messages) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    await Promise.all(
        messages.map(async (message) => {
            await Message.findByIdAndUpdate(message._id, { read: true });
        })
    );
}

async function deleteMessage(conversation_id, message_id) {
    const message = await Message.find({
        conversation_id: conversation_id,
        _id: message_id,
    });
    if (!message) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    message.remove();
}

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
    return await Socket.find({'user_id': user_id});
}

module.exports = {
    getConversataion,
    createConversation,
    findConversation,
    findConversationById,
    getConversationByPartner,
    getConversationById,
    getListConversation,
    deleteConversation,
    createMessage,
    getMessage,
    setReadMessage,
    deleteMessage,
    attachSocket,
    detachSocket,
    findActiveSockets
}
