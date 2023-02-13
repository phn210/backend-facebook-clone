const router = require('express').Router();

const FirebaseMessagingTokenController = require('../controllers/firebase-messaging-token.controller');

router.get('/test-firebase-messaging-token', (req, res) => res.send({'test': 'chat OK'}));

/**
 * @swagger
 * /it4788/upsert_firebase_messaging_token:
 *   post:
 *     summary: Upsert a FCM token
 *     description: Update or Insert FCM token
 *     tags:
 *       - PushNotification
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
 *               user_id:
 *                 type: string
 *               fcm_token:
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
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user_id:
 *                       type: string
 */
router.post('/upsert_firebase_messaging_token', FirebaseMessagingTokenController.upsertToken);

/**
 * @swagger
 * /it4788/push_notification:
 *   post:
 *     summary: Push a notification
 *     description: Testing push notification feature
 *     tags:
 *       - PushNotification
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcm_token:
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
router.post('/push_notification', FirebaseMessagingTokenController.testPushNoti);

module.exports = router;
