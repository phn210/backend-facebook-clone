const { messaging } = require("firebase-admin");
const UserFirebaseMessagingToken = require("../models/UserFirebaseMessagingToken");

async function sendPushNotification(user_id, { title, body, imageUrl }) {
  const tokens = await UserFirebaseMessagingToken.find({ user_id: user_id });
  const messages = tokens.map(x => {
    return {
      token: x.token,
      notification: {
        title: title,
        body: body,
        imageUrl: imageUrl,
      }
    };
  })
  const batchResponse = await messaging().sendAll(messages);
  return batchResponse;
};

module.exports = {
  sendPushNotification,
}