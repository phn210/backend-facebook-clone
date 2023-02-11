const router = require('express').Router();

const NotificationController = require('../controllers/notifications.controller');

router.get('/test-notification', (req, res) => res.send({'test': 'notification OK'}));

/**
 * swagger // FIXME
 * /it4788/get_notification:
 *   post:
 *     summary: Get notification
 *     description: Get notification
 *     tags:
 *       - Notification
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
 *                     type:
 *                       type: string
 *                     object_id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     notification_id:
 *                       type: string
 *                     created:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     group:
 *                       type: string
 *                     read:
 *                       type: string
 *                     last_update:
 *                       type: string
 *                     badge:
 *                       type: string
 */
router.post('/get_notification', NotificationController.getNotification);

/**
 * swagger // FIXME
 * /it4788/set_read_notification:
 *   post:
 *     summary: Set read notification
 *     description: Set read notification
 *     tags:
 *       - Notification
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
 *               notification_id:
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
 *                     badge:
 *                       type: string
 *                     last_update:
 *                       type: string
 */
router.post('/set_read_notification', NotificationController.setReadNotification);

/**
 * @swagger
 * /it4788/get_push_settings:
 *   post:
 *     summary: Get list suggested friends
 *     description: Get list suggested friends
 *     tags:
 *       - Notification
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
 *                     like_comment:
 *                       type: boolean
 *                     from_friends:
 *                       type: boolean
 *                     requested_friend:
 *                       type: boolean
 *                     suggested_friend:
 *                       type: boolean
 *                     report:
 *                       type: boolean
 *                     sound_on:
 *                       type: boolean
 *                     notification_on:
 *                       type: boolean
 *                     vibrant_on:
 *                       type: boolean
 *                     led_on:
 *                       type: boolean
 */
router.post('/get_push_settings', NotificationController.getPushSettings);

/**
 * @swagger
 * /it4788/set_push_settings:
 *   post:
 *     summary: Set list suggested friends
 *     description: Set list suggested friends
 *     tags:
 *       - Notification
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
 *               like_comment:
 *                 type: boolean
 *               from_friends:
 *                 type: boolean
 *               requested_friend:
 *                 type: boolean
 *               suggested_friend:
 *                 type: boolean
 *               report:
 *                 type: boolean
 *               sound_on:
 *                 type: boolean
 *               notification_on:
 *                 type: boolean
 *               vibrant_on:
 *                 type: boolean
 *               led_on:
 *                 type: boolean
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
router.post('/set_push_settings', NotificationController.setPushSettings);

/**
 * swagger // FIXME
 * /it4788/check_new_version:
 *   post:
 *     summary: Check app new version
 *     description: Check app new version
 *     tags:
 *       - Notification
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               last_updated:
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
 *                     version:
 *                       type: object
 *                       properties:
 *                         version:
 *                           type: string
 *                         require:
 *                           type: string
 *                         url:
 *                           type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         active:
 *                           type: string
 *                     badge:
 *                       type: string
 *                     unread_message:
 *                       type: string
 *                     now:
 *                       type: string
 */
router.post('/check_new_version', NotificationController.checkNewVersion);

module.exports = router;