const router = require('express').Router();

const UserController = require('../controllers/users.controller');

router.get('/test-user', (req, res) => res.send({'test': 'user OK'}));

/**
 * @swagger
 * /it4788/get_user_friends:
 *   post:
 *     summary: Get user's friends
 *     description: Get a user's friends
 *     tags:
 *       - User
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
 *               user_id:
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
 *                     friends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           same_friends:
 *                             type: string
 *                           created:
 *                             type: string
 *                     total:
 *                       type: string
 */
router.post('/get_user_friends', UserController.getUserFriends);

/**
 * @swagger
 * /it4788/get_user_info:
 *   post:
 *     summary: Get user's info
 *     description: Get a user's info
 *     tags:
 *       - User
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               user_id:
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
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     created:
 *                       type: string
 *                     description:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     cover_image:
 *                       type: string
 *                     link:
 *                       type: string
 *                     address:
 *                       type: string
 *                     city:
 *                       type: string
 *                     country:
 *                       type: string
 *                     num_friends:
 *                       type: string
 *                     is_friend:
 *                       type: string
 *                     online:
 *                       type: string
 */
router.post('/get_user_info', UserController.getUserInfo);

/**
 * @swagger
 * /it4788/set_user_info:
 *   post:
 *     summary: Set user's info
 *     description: Set a user's info
 *     tags:
 *       - User
 *     requestBody:
 *       description:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 required: true
 *               username:
 *                 type: string
 *               description:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               cover_image:
 *                 type: string
 *                 format: binary
 *               link:
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
 *                     avatar:
 *                       type: string
 *                     cover_image:
 *                       type: string
 *                     link:
 *                       type: string
 *                     address:
 *                       type: string
 *                     city:
 *                       type: string
 *                     country:
 *                       type: string
 */
router.post('/set_user_info', UserController.setUserInfo);

/**
 * @swagger
 * /it4788/get_list_blocks:
 *   post:
 *     summary: Get list blocked users
 *     description: Get list blocked users
 *     tags:
 *       - User
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
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     avatar:
 *                       type: string
 */
router.post('/get_list_blocks', UserController.getListBlocks);

/**
 * @swagger
 * /it4788/set_block:
 *   post:
 *     summary: Set block
 *     description: Set block
 *     tags:
 *       - User
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
 *                 require: trued
 *               type:
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
 */
router.post('/set_block', UserController.setBlock);

/**
 * @swagger
 * /it4788/set_accept_friend:
 *   post:
 *     summary: Accept a friend request
 *     description: Accept a friend request
 *     tags:
 *       - User
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
 */
router.post('/set_accept_friend', UserController.setAcceptFriend);

/**
 * @swagger
 * /it4788/get_requested_friends:
 *   post:
 *     summary: Get requested friends
 *     description: Get requested friends
 *     tags:
 *       - User
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
 *                     requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           same_friends:
 *                             type: string
 *                           created:
 *                             type: string
 *                     total:
 *                       type: string
 */
router.post('/get_requested_friends', UserController.getRequestedFriends);

/**
 * @swagger
 * /it4788/set_request_friend:
 *   post:
 *     summary: Request to be friend
 *     description: Request to be friend
 *     tags:
 *       - User
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
 *                     request_friends:
 *                       type: string
 */
router.post('/set_request_friend', UserController.setRequestFriend);

/**
 * @swagger
 * /it4788/get_list_suggested_friends:
 *   post:
 *     summary: Get list suggested friends
 *     description: Get list suggested friends
 *     tags:
 *       - User
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
 *                     list_users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           same_friends:
 *                             type: string
 */
router.post('/get_list_suggested_friends', UserController.getListSuggestedFriends);

module.exports = router;