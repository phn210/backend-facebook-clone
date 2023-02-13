const router = require("express").Router();

const ChatController = require("../controllers/chats.controller");

router.get("/test-chat", (req, res) => res.send({ test: "chat OK" }));

/**
 * @swagger
 * /it4788/get_conversation:
 *   post:
 *     summary: Get a conversation
 *     description: Get a conversations
 *     tags:
 *       - Chat
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 require: trued
 *               partner_id:
 *                 type: string
 *               conversation_id:
 *                 type: string
 *               index:
 *                 type: string
 *                 require: trued
 *               count:
 *                 type: string
 *                 require: trued
 *     responses:
 *       '200':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           message:
 *                             type: string
 *                           message_id:
 *                             type: string
 *                           unread:
 *                             type: string
 *                           created:
 *                             type: string
 *                           sender:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                           is_blocked:
 *                             type: string
 */
router.post("/get_conversation", ChatController.getConversation);

/**
 * @swagger
 * /it4788/get_list_conversation:
 *   post:
 *     summary: Get list conversations
 *     description: Get list conversations
 *     tags:
 *       - Chat
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 require: trued
 *               index:
 *                 type: string
 *                 require: trued
 *               count:
 *                 type: string
 *                 require: trued
 *     responses:
 *       '200':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           partner:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                           last_message:
 *                             type: object
 *                             properties:
 *                               message:
 *                                 type: string
 *                               created:
 *                                 type: string
 *                               unread:
 *                                 type: string
 *                     num_new_messages:
 *                       type: string
 */
router.post("/get_list_conversation", ChatController.getListConversation);

/**
 * swagger // FIXME
 * /it4788/delete_conversation:
 *   post:
 *     summary: Delete a conversation
 *     description: Delete a conversation
 *     tags:
 *       - Chat
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 require: trued
 *               partner_id:
 *                 type: string
 *               conversation_id:
 *                 type: string
 *     responses:
 *       '200':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 */
router.post("/delete_conversation", ChatController.deleteConversation);

/**
 * swagger // FIXME
 * /it4788/set_read_message:
 *   post:
 *     summary: Set read message
 *     description: Set read message
 *     tags:
 *       - Chat
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 require: trued
 *               partner_id:
 *                 type: string
 *               conversation_id:
 *                 type: string
 *     responses:
 *       '200':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 */
router.post("/set_read_message", ChatController.setReadMessage);

/**
 * swagger // FIXME
 * /it4788/delete_message:
 *   post:
 *     summary: Delete a message
 *     description: Delete a message
 *     tags:
 *       - Chat
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 require: trued
 *               message_id:
 *                 type: string
 *                 require: trued
 *               partner_id:
 *                 type: string
 *               conversation_id:
 *                 type: string
 *     responses:
 *       '200':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post("/delete_message", ChatController.deleteMessage);

module.exports = router;
