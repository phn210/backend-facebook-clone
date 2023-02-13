const response = require("./responses");
const ERROR = require("./responses/error");
const friendService = require("../services/friends.service");
const jwtService = require("../services/jwt.service");
const notificationService = require("../services/notifications.service");
const postService = require("../services/posts.service");
const userService = require("../services/users.service");
const chatService = require("../services/chats.service");
const env = require("../../lib/env");

async function getConversation(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token)) throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(
            decoded_token.payload.user
        );

        const query = {
            user_id: user._id,
            partner_id: req.body.partner_id ?? "",
            conversation_id: req.body.conversation_id ?? "",
        };

        let messages, conversation;

        if (query.partner_id == "") {
            let data = await chatService.getConversationById(
                query.conversation_id
            );
            messages = data.messages;
            conversation = data.conversation;
        } else {
            let data = await chatService.getConversationByPartner(
                query.partner_id,
                query.user_id
            );
            messages = data.messages;
            conversation = data.conversation;
        }

        const partner = await userService.findUserById(
            query.partner_id
                ? query.partner_id
                : conversation.user1_id == user._id
                ? conversation.user2_id
                : conversation.user1_id
        );
        const isBlocked = friendService.isBlock(partner._id, user._id);
        const conversationDetails = messages.map((message) => {
            let sender = message.sender_id == user._id ? user : partner;
            return {
                message: message.content,
                message_id: message._id,
                unread: !message.read,
                created: message.created_at,
                sender: {
                    id: sender._id,
                    username: sender.name,
                    avatar:
                        env.app.url +
                        (author.avatar_image?.url ??
                            "/public/assets/img/avatar-default.jpg"),
                },
                is_blocked:
                    message.sender_id == user._id ? false : isBlocked ?? false,
            };
        });

        response.sendData(res, response.CODE.OK, {
            conversation: conversationDetails,
        });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getListConversation(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token)) throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(
            decoded_token.payload.user
        );
        let conversations = await chatService.getListConversation(
            user._id,
            req.body.index ? Number(req.body.index) : 0,
            req.body.count ? Number(req.body.count) : 20
        );

        let numUnreadMessages = 0;
        const conversationDetails = await Promise.all(
            conversations.map(async (conversation) => {
                const [partner, lastMessage] = await Promise.all([
                    userService.findUserById(
                        user._id == conversation.user1_id
                            ? conversation.user2_id
                            : conversation.user1_id
                    ),
                    chatService.getConversationById(conversation._id, 0, 1),
                ]);

                if (!lastMessage.messages[0].read) numUnreadMessages++;

                return {
                    id: conversation._id,
                    partner: {
                        id: partner._id,
                        username: partner.name,
                        avatar:
                            env.app.url +
                            (author.avatar_image?.url ??
                                "/public/assets/img/avatar-default.jpg"),
                    },
                    last_message: {
                        message: lastMessage.messages[0].content,
                        created: lastMessage.messages[0].created_at,
                        unread: !lastMessage.messages[0].read,
                    },
                };
            })
        );

        response.sendData(res, response.CODE.OK, {
            conversations: conversationDetails,
            num_new_messages: numUnreadMessages,
        });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function deleteConversation(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setReadMessage(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function deleteMessage(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

module.exports = {
    getConversation,
    deleteMessage,
    getListConversation,
    deleteConversation,
    setReadMessage,
};
