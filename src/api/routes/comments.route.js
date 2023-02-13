const router = require('express').Router();

const CommentController = require('../controllers/comments.controller');

router.get('/test-comment', (req, res) => res.send({'test': 'comment OK'}))

/**
 * @swagger
 * /it4788/get_comment:
 *   post:
 *     summary: Get comment on post
 *     description: Get a comment on a post
 *     tags:
 *       - Comment
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
 *                     comment:
 *                       type: string
 *                     created:
 *                       type: string
 *                     poster:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     is_blocked:
 *                       type: boolean
 */
router.post('/get_comment', CommentController.getComment);

/**
 * @swagger
 * /it4788/set_comment:
 *   post:
 *     summary: Comment on post
 *     description: Comment on a post
 *     tags:
 *       - Comment
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
 *               comment:
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
 *                     comment:
 *                       type: string
 *                     created:
 *                       type: string
 *                     poster:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     is_blocked:
 *                       type: string
 */
router.post('/set_comment', CommentController.setComment);

module.exports = router;