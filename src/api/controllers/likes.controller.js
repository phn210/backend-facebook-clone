const request = require('./requests');
const response = require('./responses');
const ERROR = require('./responses/error');
const jwtService = require('../services/jwt.service');
const friendService = require('../services/friends.service');
const notificationService = require('../services/notifications.service');
const postService = require('../services/posts.service');
const userService = require('../services/users.service');

async function like(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);
        
        const like = await postService.toggleLike(user._id, post._id);
        if (!like) response.sendData(res, response.CODE.OK);
        // try {
        //     const friends = await friendService.findUserFriends(user._id, 0, 0);
        //     await Promise.all([
        //         notificationService.createNotification({
        //             user_id: mongoose.Types.ObjectId(post.author),
        //             type: notification.type,
        //             read: false,
        //             related_id: mongoose.Types.ObjectId(like._id)
        //         }),
        //         friends.map(async (friend) => {
        //             return await notificationService.createNotification({
        //                 user_id: mongoose.Types.ObjectId(notification.user_id),
        //                 type: notification.type,
        //                 read: false,
        //                 related_id: mongoose.Types.ObjectId(notification.related_id)
        //             })
        //         })
        //     ].flat())
        // } catch (error) {

        // }
        response.sendData(res, response.CODE.OK, { 'like': like });
    } catch (error) {
        response.sendError(res, error);
    }
}

module.exports = {
    like
}
