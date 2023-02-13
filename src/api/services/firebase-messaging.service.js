const { messaging } = require("firebase-admin");
const UserFirebaseMessagingToken = require("../models/UserFirebaseMessagingToken");
const userService = require('../services/users.service');
const env = require('../../lib/env');

async function sendPushNotification(user_id, { title, body, data }) {
	const tokens = await UserFirebaseMessagingToken.find({ user_id: user_id });
	const messages = tokens.map(x => {
		return {
			token: x.token,
			notification: {
				title: title,
				body: body,
				imageUrl: `${env.app.url}${env.app.logo}`
			},
			data: data
		};
	});

	if (!messages || messages.length == 0) return;
	const batchResponse = await messaging().sendAll(messages);
	return batchResponse;
};

async function upsertFirebaseToken(user_id, fcm_token) {
    const token = await UserFirebaseMessagingToken.findOne({$and: [{'user_id': user_id}, {'token': fcm_token}]});
    if (token) return token.token;

	const newToken = new UserFirebaseMessagingToken({ 'user_id': user_id, 'token': fcm_token })
    await newToken.save();
	return newToken.token;
}

module.exports = {
  	sendPushNotification,
	upsertFirebaseToken
}