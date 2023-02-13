const mongoose = require('mongoose');
const jwtService = require('../services/jwt.service');
const userService = require('../services/users.service');
const firebaseService = require('../services/firebase-messaging.service');
const response = require('./responses');
const UserFirebaseMessagingToken = require('../models/UserFirebaseMessagingToken');
const ERROR = require('./responses/error');
const env = require('../../lib/env');

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
    const type = req.body.type ?? 'NONE';
    const existed = await UserFirebaseMessagingToken.findOne({ 'token': fcmToken });
    
    const info = ((_type) => {
      switch (_type) {
        case 'POST': {
          return {
            type: 'POST',
            object_id: '63e83f924348c2d239c4899c',
            title: 'Forward to this post',
            group: 1
          };
        }
        case 'PROFILE': {
          return {
            type: 'PROFILE',
            object_id: '63d93f2659ffb0d390d8d04a',
            title: 'Forward to this profile',
            group: 1
          };
        }
        case 'NONE': {
          return {
            type: 'NONE',
            object_id: '',
            title: 'Do nothing',
            group: 0
          };
        }
      }
    })(type);

    console.log(info);

    if (existed) {
      firebaseService.sendPushNotification(existed.user_id, {
        title: 'IT4788 Facebook',
        body: 'This is a test notification',
        data: {
          type: info.type.toString(),
          object_id: info.object_id.toString(),
          title: info.title.toString(),
          notification_id: '',
          created_at: new Date().toString(),
          avatar: `${env.app.url}${'/public/assets/img/avatar-default.jpg'}`.toString(),
          group: info.group.toString(),
          read: false.toString()
        }
      })
      response.sendData(res, response.CODE.OK);
      return;
    }
    const newId = new mongoose.Types.ObjectId()
    const doc = new UserFirebaseMessagingToken({ user_id: newId, token: fcmToken });
    await doc.save();

    

    firebaseService.sendPushNotification(newId, {
      title: 'IT4788 Facebook',
      body: 'This is a test notification',
      data: {
        type: info.type,
        object_id: info.object_id,
        title: info.title,
        notification_id: '',
        created_at: new Date(),
        avatar: `${env.app.url}${'/public/assets/img/avatar-default.jpg'}`,
        group: info.group,
        read: false
      }
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