const userService = require('../services/users.service');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

async function createConversation(conversation) {}

async function getConversationByPartner(partner_id) {}

async function getConversationById(conversation_id) {}

async function getConversation() {}

async function deleteConversation(conversation_id) {}

async function setMessage(conversation_id, message) {}

async function getMessage(conversation_id, message_id) {}

async function setReadMessage(conversation_id, message_id) {}

async function deleteMessage(conversation_id, message_id) {}

module.exports = {
    createConversation,
    getConversationByPartner,
    getConversationById,
    getConversation,
    deleteConversation,
    setMessage,
    getMessage,
    setReadMessage,
    deleteMessage
}