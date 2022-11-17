const router = require('express').Router();

const SearchController = require('../controllers/search');

router.get('/test-search', (req, res) => res.send({'test': 'search OK'}))

/**
 * @swagger
 * /it4788/api/search:
 *   post:
 *     summary: Search
 *     description: Search with a keyword
 *     tags:
 *       - Search
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               keyword:
 *                 type: string
 *                 required: true
 *               user_id:
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
 *                       id:
 *                         type: string
 *                       image:
 *                         type: string
 *                       video:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                           thumb:
 *                             type: string
 *                       like:
 *                         type: string
 *                       comment:
 *                         type: string
 *                       is_liked:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       described:
 *                         type: string
 */
router.post('/search', SearchController.search);

/**
 * @swagger
 * /it4788/api/get_saved_search:
 *   post:
 *     summary: Get saved search
 *     description: Get a user's saved search
 *     tags:
 *       - Search
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
 *                       id:
 *                         type: string
 *                       keyword:
 *                         type: string
 *                       created:
 *                         type: string
 */
router.post('/get_saved_search', SearchController.getSavedSearch);

/**
 * @swagger
 * /it4788/api/del_saved_search:
 *   post:
 *     summary: Delete saved search
 *     description: Delete a user's saved search
 *     tags:
 *       - Search
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
 *               search_id:
 *                 type: string
 *               all:
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
router.post('/del_saved_search', SearchController.delSavedSearch);

module.exports = router;