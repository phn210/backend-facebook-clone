const router = require('express').Router();

const LikeController = require('../controllers/likes.controller');

router.get('/test-like', (req, res) => res.send({'test': 'like OK'}))

/**
 * @swagger
 * /it4788/like:
 *   post:
 *     summary: Like post
 *     description: Like a post
 *     tags:
 *       - Like
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
 *                     like:
 *                       type: string
 */
router.post('/like', LikeController.like);

module.exports = router;