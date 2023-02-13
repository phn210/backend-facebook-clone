const mongoose = require("mongoose");

const userService = require("../services/users.service");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const ERROR = require("../controllers/responses/error");

async function createConversation(conversation) {}

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

async function setMessage(conversation_id, message) {}

async function getMessage(conversation_id, message_id) {}

async function setReadMessage(conversation_id) {
    const messages = await Message.find({
        conversation_id: mongoose.Types.ObjectId(conversation_id),
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
    const message = await Message.findOne({
        conversation_id: conversation_id,
        _id: message_id,
    });
    if (!message) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    message.remove();
}

module.exports = {
    getConversataion,
    createConversation,
    getConversationByPartner,
    getConversationById,
    getListConversation,
    deleteConversation,
    setMessage,
    getMessage,
    setReadMessage,
    deleteMessage,
};
