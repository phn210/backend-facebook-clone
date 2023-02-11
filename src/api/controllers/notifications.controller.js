const request = require('./requests');
const response = require('./responses');
const ERROR = require('./responses/error');
const jwtService = require('../services/jwt.service');
const notificationService = require('../services/notifications.service');
const userService = require('../services/users.service');
const env = require('../../lib/env');

async function getNotification(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function setReadNotification(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getPushSettings(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const pushSetting = await notificationService.getPushSetting(user._id);
        if(!pushSetting) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
        
        response.sendData(res, response.CODE.OK, pushSetting);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setPushSettings(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const pushSetting = {
            user_id: user._id,
            like_comment: req.body.like_comment ?? true,
            from_friends: req.body.from_friends ?? true,
            requested_friend: req.body.requested_friend ?? true,
            suggested_friend: req.body.suggested_friend ?? true,
            report: req.body.report ?? true,
            sound_on: req.body.sound_on ?? true,
            notification_on: req.body.notification_on ?? true,
            vibrant_on: req.body.vibrant_on ?? true,
            led_on: req.body.led_on ?? true            
        }

        const newSetting = await notificationService.savePushSetting(pushSetting);

        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function checkNewVersion(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}


module.exports = {
    getNotification,
    setReadNotification,
    getPushSettings,
    setPushSettings,
    checkNewVersion
}