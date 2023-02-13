const response = require('./responses');
const ERROR = require('./responses/error');
const friendService = require('../services/friends.service');
const jwtService = require('../services/jwt.service');
const notificationService = require('../services/notifications.service');
const postService = require('../services/posts.service');
const userService = require('../services/users.service');
const env = require('../../lib/env');

async function getComment(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);

        const query = {
            index: req.body.index ? Number(req.body.index) : 0,
            count: req.body.count ? Number(req.body.count) : 20,
        }

        const comments = await postService.getPostComments(post._id, query.index, query.count);
        const commentsDetails = await Promise.all(comments.map(async (com) => {
            const [poster, isBlocked] = await Promise.all([
                userService.findUserById(com.author_id),
                friendService.isBlock(post.author, com.author_id)
            ]);
            return {
                'id': com._id,
                'comment': com.comment,
                'created': com.created_at,
                'poster': {
                    'id': poster._id,
                    'username': poster.name,
                    'avatar': env.app.url+(poster.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg')
                },
                'is_blocked': isBlocked
            }
        }));

        response.sendData(res, response.CODE.OK, commentsDetails);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setComment(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);

        const comment = {
            post_id: post._id,
            author_id: user._id,
            comment: req.body.comment
        }

        const newComment = await postService.createComment(comment);
        try {
            const friends = await friendService.findUserFriends(user._id, 0, 0);
            await Promise.all([
                notificationService.createNotification({
                    user_id: post.author,
                    type: 'COMMENT',
                    read: false,
                    related_id: newComment._id
                }),
                ...friends.map(async (friend) => {
                    return await notificationService.createNotification({
                        user_id: friend._id,
                        type: 'FRIEND_COMMENT',
                        read: false,
                        related_id: newComment._id
                    })
                })
            ].flat());
        } catch (error) {
            console.error(error);
        }
        const [poster, isBlocked] = await Promise.all([
            userService.findUserById(newComment.author_id),
            friendService.isBlock(post.author, newComment.author_id)
        ]);
        const commentDetails = {
            'id': newComment._id,
            'comment': newComment.comment,
            'poster': {
                'id': poster._id,
                'username': poster.name,
                'avatar': env.app.url+(poster.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg')
            },
            'created': newComment.created_at,
            'is_blocked': isBlocked
        }

        response.sendData(res, response.CODE.OK, commentDetails);
    } catch (error) {
        response.sendError(res, error);
    }
}


module.exports = {
    getComment, 
    setComment
}