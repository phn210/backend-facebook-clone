const mongoose = require('mongoose');
const jwtService = require('../services/jwt.service');
const userService = require('../services/users.service');
const firebaseService = require('../services/firebase-messaging.service');
const response = require('./responses');
const UserFirebaseMessagingToken = require('../models/UserFirebaseMessagingToken');
const ERROR = require('./responses/error');

async function upsertToken(req, res, next) {
  try {
    const token = req.body.token;
    const fcmToken = req.body.fcm_token;
    if (!jwtService.verify(token))
      throw ERROR.TOKEN_IS_INVALID;
    const decoded_token = jwtService.decode(token);
    const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);
    const existed = await UserFirebaseMessagingToken.findOne({ 'user_id': user.id, 'token': fcmToken });
    console.log(existed);
    if (existed) {
      return response.sendData(res, response.CODE.ERROR.FIREBASE_MESSAGING_TOKEN_EXISTED, {});
    }
    const doc = new UserFirebaseMessagingToken({ user_id: user.id, token: fcmToken });
    await doc.save();
    response.sendData(res, response.CODE.OK, doc);
  } catch (e) {
    response.sendError(res, e);
  }
}

async function testPushNoti(req, res, next) {
  try {
    const fcmToken = req.body.fcm_token;
    const existed = await UserFirebaseMessagingToken.findOne({ 'token': fcmToken });
    console.log(existed);
    if (existed) {
      firebaseService.sendPushNotification(existed.user_id, {
        title: "Test notification",
        body: "Hello",
      })
      response.sendData(res, response.CODE.OK);
      return;
    }
    const newId = new mongoose.Types.ObjectId()
    const doc = new UserFirebaseMessagingToken({ user_id: newId, token: fcmToken });
    await doc.save();
    firebaseService.sendPushNotification(newId, {
      title: "Test notification",
      body: "Hello",
    })
    response.sendData(res, response.CODE.OK);
  } catch (error) {
    response.sendError(res, error);
  }
}

module.exports = {
  upsertToken,
  testPushNoti
}