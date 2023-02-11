const mongoose = require('mongoose');

const ERROR = require('../controllers/responses/error');
const Notification = require('../models/Notification');
const PushSetting = require('../models/PushSetting');

async function getUserNotifications(user_id, types=[]) {
    if (types.length > 0)
        return Notification.find({ $and: [ {'user_id': user_id}, {'types': {$in: types}} ]});
    return Notification.find({'user_id': user_id});
}

async function isNotificationAllowed(user_id, type) {
    const pushSetting = await getPushSetting(user_id);
    type = type.toUpperCase();
    switch (true) {
        case (['LIKE', 'COMMENT'].includes(type)):
            return pushSetting?.like_comment ?? false;
        case (['FRIEND_LIKE', 'FRIEND_COMMENT', 'FRIEND_POST'].includes(type)):
            return pushSetting?.from_friends ?? false;
        case (['FRIEND_REQUEST', 'FRIEND_ACCEPTED'].includes(type)):
            return pushSetting?.requested_friend ?? false;
        case (['FRIEND_SUGGESTED'].includes(type)):
            return pushSetting?.suggested_friend ?? false;
        case (['REPORT'].includes(type)):
            return pushSetting?.report ?? false;
        case (['LOGIN'].includes(type)):
            return true;
        default:
            throw ERROR.PARAMETER_VALUE_IS_INVALID;
    }
}

async function createNotification(notification) {
    if (!(await isNotificationAllowed(notification.user_id, notification.type))) return null;
    const newNotification = new Notification({
        user_id: mongoose.Types.ObjectId(notification.user_id),
        type: notification.type,
        read: false,
        related_id: mongoose.Types.ObjectId(notification.related_id)
    })

    await newNotification.save();
    return newNotification;
}

async function updateNotification(notification) {
    let updatedNotification = Notification.findById(mongoose.Types.ObjectId(notification._id));
    if (!updatedNotification) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    updatedNotification.read = true;
    await updatedNotification.save();
    return updatedNotification;
}

async function deleteNotification(notification_id) {
    let deletedNotification = Notification.findById(mongoose.Types.ObjectId(notification_id));
    if (!deletedNotification) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    await deletedNotification.remove();
}

async function savePushSetting(pushSetting) {
    let currentSetting = await PushSetting.findOne({'user_id': pushSetting.user_id});
    if (!currentSetting) {
        const newSetting = new PushSetting(pushSetting);
        await newSetting.save();
        return newSetting;
    } else {
        Object.assign(currentSetting, pushSetting);
        await currentSetting.save();
        return currentSetting;
    }
}

async function getPushSetting(user_id) {
    return await PushSetting.findOne({'user_id': mongoose.Types.ObjectId(user_id)});
}

module.exports = {
    getUserNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    isNotificationAllowed,
    savePushSetting,
    getPushSetting
}