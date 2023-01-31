const router = require('express').Router();
const multer = require('multer');

const AuthController = require('../controllers/auth.controller');
const UploadMiddleware = require('../middlewares/upload.middleware');

router.get('/test-auth', (req, res) => res.send({'test': 'auth OK'}));

/**
 * @swagger
 * /it4788/signup:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Auth
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *                 format: password
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
 *                   $ref: '#/components/schemas/User'
 */
 router.post('/signup', AuthController.signup);

/**
 * @swagger
 * /it4788/login:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Auth
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *               device_id:
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /it4788/logout:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Auth
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
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
router.post('/logout', AuthController.logout);

/**
 * @swagger
 * /it4788/get_verify_code:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Auth
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
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
 *                     verify_code:
 *                       type: string
 */
router.post('/get_verify_code', AuthController.getVerifyCode);

/**
 * @swagger
 * /it4788/check_verify_code:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Auth
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *                 required: true
 *               verify_code:
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
 *                     active:
 *                       type: string
 */
router.post('/check_verify_code', AuthController.checkVerifyCode);

/**
 * @swagger
 * /it4788/change_info_after_signup:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Auth
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
 *                 required: true
 *               avatar:
 *                 type: string
 *                 format: binary
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
 *                     phone_number:
 *                       type: string
 *                     created:
 *                       type: string
 *                     avatar:
 *                       type: string
 */
router.post(
    '/change_info_after_signup',
    UploadMiddleware.upload(),
    AuthController.changeInfoAfterSignUp);

/**
 * @swagger
 * /it4788/change_password:
 *   post:
 *     summary: 
 *     description: 
 *     tags:
 *       - Auth
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
 *               password:
 *                 type: string
 *                 required: true
 *               new_password:
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
 *                   type: string
 */
router.post('/change_password', AuthController.changePassword);

/**
 * @swagger
 * /it4788/set_dev_token:
 *   post:
 *     summary: Set Dev token
 *     description: Set Dev token
 *     tags:
 *       - Auth
 *     requestBody:
 *       description:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               dev_type:
 *                 type: string
 *               dev_token:
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
 *                   type: string
 */
router.post('/set_dev_token', AuthController.setDevToken);

module.exports = router;

