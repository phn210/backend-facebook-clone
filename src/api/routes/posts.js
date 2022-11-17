const router = require('express').Router();

const PostController = require('../controllers/posts');

router.get('/test-post', (req, res) => res.send({'test': 'post OK'}))

/**
 * @swagger
 * /it4788/api/get_list_posts:
 *   post:
 *     summary: Get list of posts
 *     description: Get a list of posts
 *     tags:
 *       - Post
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
 *               last_id:
 *                 type: string
 *               index:
 *                 type: string
 *                 required: true
 *               count:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: binary
 *                       video:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                           thumb:
 *                             type: string
 *                       described:
 *                         type: string
 *                       created:
 *                         type: string
 *                       like:
 *                         type: string
 *                       comment:
 *                         type: string
 *                       is_liked:
 *                         type: string
 *                       is_blocked:
 *                         type: string
 */
router.post('/get_list_posts', PostController.getListPosts);

/**
 * @swagger
 * /it4788/api/get_post:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Post
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 required: true
 *               id:
 *                 type: string
 *                 required: true
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
 *                     describe:
 *                       type: string
 *                     created:
 *                       type: string
 *                     modified:
 *                       type: string
 *                     like:
 *                       type: string
 *                     comment:
 *                       type: string
 *                     is_liked:
 *                       type: string
 */
router.post('/get_post', PostController.getPost);

/**
 * @swagger
 * /it4788/api/add_post:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Post
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
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               video:
*                  type: string
*                  format: binary
 *               describe:
 *                 type: string
 *               status:
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
 *                     url:
 *                       type: string
 */
router.post('/add_post', PostController.addPost);

/**
 * @swagger
 * /it4788/api/edit_post:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Post
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
 *               id:
 *                 type: string
 *                 required: true
 *               describe:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               image_del:
 *                 type: array
 *                 items:
 *                   type: string
 *               image_sort:
 *                 type: array
 *                 items:
 *                   type: string
 *               video:
 *                 type: string
 *                 format: binary
 *               thumb:
 *                 type: string
 *                 format: binary
 *               auto_block:
 *                 type: boolean
 *               auto_accept:
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
router.post('/edit_post', PostController.editPost);

/**
 * @swagger
 * /it4788/api/delete_post:
 *   post:
 *     summary: Delete post
 *     description: Delete post
 *     tags:
 *       - Post
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 required: true
 *               id:
 *                 type: string
 *                 required: true
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
router.post('/delete_post', PostController.deletePost);

/**
 * @swagger
 * /it4788/api/report_post:
 *   post:
 *     summary: Report post
 *     description: Report a post
 *     tags:
 *       - Post
 *     requestBody:
 *       description:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 required: true
 *               id:
 *                 type: string
 *                 required: true
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
router.post('/report_post', PostController.reportPost);

/**
 * @swagger
 * /it4788/api/check_new_item:
 *   post:
 *     summary: Check new item
 *     description: Check new item
 *     tags:
 *       - Post
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               last_id:
 *                 type: string
 *                 required: true
 *               category_id:
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       new_items:
 *                         type: string
 */
router.post('/check_new_item', PostController.checkNewItem);

/**
 * @swagger
 * /it4788/api/get_list_videos:
 *   post:
 *     summary: Get list videos
 *     description: Get list videos
 *     tags:
 *       - Post
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
 *               last_id:
 *                 type: string
 *               index:
 *                 type: string
 *                 required: true
 *               count:
 *                 type: string
 *                 required: true
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       post:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           video:
 *                             type: object
 *                             properties:
 *                               url:
 *                                 type: string
 *                               thumb:
 *                                 type: string
 *                           described:
 *                             type: string
 *                           created:
 *                             type: string
 *                           like:
 *                             type: string
 *                           comment:
 *                             type: string
 *                           is_liked:
 *                             type: string
 *                           is_blocked:
 *                             type: string
 *                           can_comment:
 *                             type: string
 *                           can_edit:
 *                             type: string
 *                           banned:
 *                             type: string
 *                           state:
 *                             type: string
 *                           author:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                       new_items:
 *                         type: string
 *                       last_id:
 *                         type: string
 */
router.post('/get_list_videos', PostController.getListVideos);

module.exports = router;