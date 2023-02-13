const response = require('./responses');
const ERROR = require('./responses/error');
const friendService = require('../services/friends.service');
const jwtService = require('../services/jwt.service');
const notificationService = require('../services/notifications.service');
const postService = require('../services/posts.service');
const userService = require('../services/users.service');
const env = require('../../lib/env');

async function getConversation(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const query = {

        }

        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getListConversation(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function deleteConversation(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setReadMessage(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function deleteMessage(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}


module.exports = {
    getConversation,
    deleteMessage,
    getListConversation,
    deleteConversation,
    setReadMessage
}