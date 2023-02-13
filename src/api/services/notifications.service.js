const mongoose = require('mongoose');

const ERROR = require('../controllers/responses/error');
const friendService = require('../services/friends.service');
const notificationService = require('../services/notifications.service');
const postService = require('../services/posts.service');
const userService = require('../services/users.service');
const Notification = require('../models/Notification');
const PushSetting = require('../models/PushSetting');

async function getUserNotifications(user_id, types=[], index=0, count=20) {
    if (types.length > 0)
        return await Notification.find({ 
            $and: [ {'user_id': user_id}, {'types': {$in: types}} ]
        }).sort('-created_at')
        .skip(index*count)
        .limit(count);
    return await Notification.find({'user_id': user_id})
                    .sort('-created_at')
                    .skip(index*count)
                    .limit(count);
}

async function countUnreadNotifications(user_id) {
    return await Notification.find({ 
        $and: [ {'user_id': user_id}, {'read': false} ]
    }).length ?? 0;
}

async function isNotificationAllowed(user_id, type) {
    const pushSetting = await getPushSetting(user_id);
    type = type.toUpperCase();
    switch (true) {
        case (['LIKE', 'COMMENT'].includes(type)):
            return pushSetting?.like_comment ?? true;
        case (['FRIEND_LIKE', 'FRIEND_COMMENT', 'FRIEND_POST'].includes(type)):
            return pushSetting?.from_friends ?? true;
        case (['FRIEND_REQUEST', 'FRIEND_ACCEPTED'].includes(type)):
            return pushSetting?.requested_friend ?? true;
        case (['FRIEND_SUGGESTED'].includes(type)):
            return pushSetting?.suggested_friend ?? true;
        case (['REPORT'].includes(type)):
            return pushSetting?.report ?? true;
        case (['LOGIN'].includes(type)):
            return true;
        default:
            throw ERROR.PARAMETER_VALUE_IS_INVALID;
    }
}

async function getNotificationInfo(notification) {
    switch (notification.type) {
        case ('LIKE'): {
            const like = await postService.findOneLike(notification.related_id);
            const [user, post] = await Promise.all([
                userService.findUserById(like.user_id),
                postService.findOnePost(like.post_id)
            ]);

            return {
                type: 'POST',
                object_id: post._id,
                title: `${user.name ?? 'Somebody'} liked your post.`,
                avatar: user.avatar_image,
                group: 1
            };
        }
        case ('FRIEND_LIKE'): {
            const like = await postService.findOneLike(notification.related_id);
            const [user, post] = await Promise.all([
                userService.findUserById(like.user_id),
                postService.findOnePost(like.post_id)
            ]);

            return {
                type: 'POST',
                object_id: post._id,
                title: `${user.name ?? 'Your friend'} liked a post.`,
                avatar: user.avatar_image,
                group: 1
            };
        }
        case ('COMMENT'): {
            const comment = await postService.findOneComment(notification.related_id);
            const [user, post] = await Promise.all([
                userService.findUserById(comment.author_id),
                postService.findOnePost(comment.post_id)
            ]);

            return {
                type: 'POST',
                object_id: post._id,
                title: `${user.name ?? 'Somebody'} commented on your post.`,
                avatar: user.avatar_image,
                group: 1
            };
        }
        case ('FRIEND_COMMENT'): {
            const comment = await postService.findOneComment(notification.related_id);
            const [user, post] = await Promise.all([
                userService.findUserById(comment.author_id),
                postService.findOnePost(comment.post_id)
            ]);

            return {
                type: 'POST',
                object_id: post._id,
                title: `${user.name ?? 'Your friend'} commented a post.`,
                avatar: user.avatar_image,
                group: 1
            };
        }
        case ('FRIEND_REQUEST'): {
            const request = await friendService.findOneRequest(notification.related_id);

            const user = await userService.findUserById(request.sender_id);

            return {
                type: 'PROFILE',
                object_id: user._id,
                title: `${user.name ?? 'Somebody'} sent you a friend request.`,
                avatar: user.avatar_image,
                group: 1
            };
        }
        case ('FRIEND_ACCEPTED'): {
            const request = await friendService.findOneRequest(notification.related_id);

            const user = await userService.findUserById(request.receiver_id);

            return {
                type: 'PROFILE',
                object_id: user._id,
                title: `${user.name ?? 'Somebody'} sent you a friend request.`,
                avatar: user.avatar_image,
                group: 1
            };
        }
        case ('FRIEND_SUGGESTED'):
            return 'NONE';
        case ('BIRTHDAY'):
            return 'NONE';
        case ('LOGIN'):
            return 'NONE';
        default:
            return null;
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

async function updateNotification(notification_id) {
    let updatedNotification = await Notification.findById(mongoose.Types.ObjectId(notification_id));
    if (!updatedNotification) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    updatedNotification.read = true;
    await updatedNotification.save();
    return updatedNotification;
}

async function deleteNotification(notification) {
    let deletedNotification = Notification.findOne({
        'user_id': mongoose.Types.ObjectId(notification.user_id),
        'type': notification.type,
        'related_id': mongoose.Types.ObjectId(notification.related_id)
    });
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
    countUnreadNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    isNotificationAllowed,
    getNotificationInfo,
    savePushSetting,
    getPushSetting
}