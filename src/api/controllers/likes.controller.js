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
        
        const [like, isLike] = await postService.toggleLike(user._id, post._id);
        try {
            const friends = (await friendService.findUserFriends(user._id, 0, 0))
            .map(friend => (friend.user1_id.toString() == user._id.toString()) ? friend.user2_id.toString() : friend.user1_id.toString());
            if (isLike) {
                await Promise.all([
                    notificationService.createNotification({
                        user_id: post.author,
                        type: 'LIKE',
                        read: false,
                        related_id: like._id
                    }),
                    ...friends.map(async (friend) => {
                        return await notificationService.createNotification({
                            user_id: friend._id,
                            type: 'FRIEND_LIKE',
                            read: false,
                            related_id: like._id
                        })
                    })
                ].flat());
            } else {
                await Promise.all([
                    notificationService.deleteNotification({
                        user_id: post.author,
                        type: 'LIKE',
                        related_id: like._id
                    }),
                    ...friends.map(async (friend) => {
                        return await notificationService.deleteNotification({
                            user_id: friend._id,
                            type: 'FRIEND_LIKE',
                            related_id: like._id
                        })
                    })
                ].flat());
            }
        } catch (error) {
            console.error(error);
        }
        const totalLikes = (await postService.getPostLikes(post._id)).length;
        response.sendData(res, response.CODE.OK, { 'like': totalLikes });
    } catch (error) {
        response.sendError(res, error);
    }
}

module.exports = {
    like
}
