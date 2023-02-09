const ERROR = require('../controllers/responses/error');
const Notification = require('../models/Notification');

async function getUserNotifications(user_id, types=[]) {
    if (types.length > 0)
        return Notification.find({ $and: [ {'user_id': user_id}, {'types': {$in: types}} ]});
    return Notification.find({'user_id': user_id});
}

async function createNotification(user_id, notification) {
    const newNotification = new Notification({
        user_id: user_id,
        type: notification.type,
        title: notification.title,
        read: false,
        related_id: notification.related_id
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

async function deleteNotification(notification) {
    let deletedNotification = Notification.findById(mongoose.Types.ObjectId(notification._id));
    if (!deletedNotification) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    await deletedNotification.remove();
}

module.exports = {
    getUserNotifications,
    createNotification,
    updateNotification
}