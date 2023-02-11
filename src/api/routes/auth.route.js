const router = require('express').Router();
const multer = require('multer');

const AuthController = require('../controllers/auth.controller');
const UploadMiddleware = require('../middlewares/upload.middleware');

/**
 * @swagger
 * /it4788/signup:
 *   post:
 *     summary: Signup
 *     description: Signup with new phone number and receive verify code in response (to be updated to SMS) 
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
 *                   type: object
 *                   properties:
 *                     verify_code:
 *                       type: string
 */
 router.post('/signup', AuthController.signup);

/**
 * @swagger
 * /it4788/login:
 *   post:
 *     summary: Login
 *     description: Login with a signup phone number, device_id is currently unused
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
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     token:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /it4788/logout:
 *   post:
 *     summary: Logout
 *     description: Don't really do anything :) Remove token in app to logout
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
 *     summary: Get new verify code
 *     description: Generate new verify code if not verified and receive in response (to be updated to SMS)
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
 *     summary: Verify user
 *     description: Submit verify code to verify user
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
 *                     is_verified:
 *                       type: string
 */
router.post('/check_verify_code', AuthController.checkVerifyCode);

/**
 * @swagger
 * /it4788/change_info_after_signup:
 *   post:
 *     summary: Change info after signup
 *     description: Update user's info after signup
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
 *               cover:
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
router.post('/change_info_after_signup', UploadMiddleware.upload(), AuthController.changeInfoAfterSignUp);

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
 * swagger // FIXME
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

