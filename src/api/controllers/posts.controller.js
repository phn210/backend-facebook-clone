const request = require('./requests');
const response = require('./responses');
const friendService = require('../services/friends.service');
const jwtService = require('../services/jwt.service');
const postService = require('../services/posts.service');
const userService = require('../services/users.service');
const env = require('../../lib/env');
const { File } = require('../models/File');
const { ERROR } = require('./responses/code');

async function getListPosts(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const query = {
            last_id: req.body.last_id ?? null,
            user_id: req.body.user_id ?? '',
            index: req.body.index ? Number(req.body.index) : 0,
            count: req.body.count ? Number(req.body.count) : 20,
        }
        
        let posts;

        if (query.user_id == '') {
            posts = await postService.getFeedPosts(user._id, query.last_id, query.index, query.count);
        } else {
            if(await friendService.isBlock(user_id, user._id))
                throw ERROR.NOT_ACCESS;
            posts = await postService.getUsersPosts([user._id], last_id, index, count);
        }

        const postsDetails = await Promise.all(posts.map(async (post) => {
            const [likes, comments, isLiked, author, isBlocked] = await Promise.all([
                postService.getPostLikes(post._id),
                postService.getPostComments(post._id),
                postService.isLiked(user._id, post._id),
                userService.findUserById(post.author),
                friendService.isBlock(post.author, user._id)
            ]);

            return {
                'id': post._id,
                'content': post.content,
                'image': post.image.map(img => env.app.url+img.url),
                'video': post.video?.url ? env.app.url+post.video?.url : '',
                'created': post.created_at,
                'like': likes?.length ?? 0,                      
                'comment': comments?.length ?? 0,                   
                'is_liked': isLiked ?? false,
                'is_blocked': isBlocked ?? false,
                'can_comment': !isBlocked ?? true,
                'can_edit': !isBlocked ?? true,
                'status': post.status,
                'author': {
                    'id': author._id,
                    'username': author.name,
                    'avatar': env.app.url+(author.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg'),
                    'online': true          // FIXME
                }
            }
        }))

        response.sendData(res, response.CODE.OK, {
            'posts': postsDetails
        });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getPost(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);

        const [likes, comments, isLiked, author, isBlocked] = await Promise.all([
            postService.getPostLikes(post._id),
            postService.getPostComments(post._id),
            postService.isLiked(user._id, post._id),
            userService.findUserById(post.author),
            friendService.isBlock(post.author, user._id)
        ]);

        response.sendData(res, response.CODE.OK, {
            'id': post._id,
            'content': post.content,
            'status': post.status,
            'created': post.created_at,
            'modified': post.modified,
            'like': likes?.length ?? 0,                      
            'comment': comments?.length ?? 0,                   
            'is_liked': isLiked ?? false,
            'image': post.image.map(img => env.app.url+img.url),
            'video': post.video?.url ? env.app.url+post.video?.url : '',
            'author': {
                'id': author._id,
                'username': author.name,
                'avatar': env.app.url+(author.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg')
            },
            'is_blocked': isBlocked
        });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function addPost(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const author = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const image = req.files?.image ? req.files?.image : null;
        const video = req.files?.video ? req.files?.video[0] : null;

        if ((image && video) || image?.length > 4) throw ERROR.MAXIMUM_NUMBER_OF_IMAGES;

        const post = {
            author: author._id,
            content: req.body.describe ?? '',
            status: req.body.status ?? ''
        }

        if (post.content.length > 500) throw ERROR.PARAMETER_VALUE_IS_INVALID;

        if (image) post.image = image.map(img => new File({
            filename: img.filename,
            url: '/public/uploads/'+img.filename
        }));

        if (video) post.video = new File({
            filename: video.filename,
            url: '/public/uploads/'+video.filename
        });

        const newPost = await postService.createPost(post);

        response.sendData(res, response.CODE.OK, {
            'id': newPost._id,
            'content': newPost.content,
            'status': newPost.status,
            'created': newPost.created_at,
            'modified': newPost.modified,
            'like': 0,                      
            'comment': 0,                   
            'is_liked': false,
            'image': newPost.image.map(img => env.app.url+img.url),
            'video': newPost.video?.url ? env.app.url+newPost.video?.url : '',
            'author': {
                'id': author._id,
                'username': author.name,
                'avatar': env.app.url+(author.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg')
            },
            'is_blocked': false
        });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function editPost(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);

        if (user._id.toString() != post.author.toString())
            throw ERROR.NOT_ACCESS;

        const image = req.files?.image ? req.files?.image : null;
        const video = req.files?.video ? req.files?.video[0] : null;

        if ((image && video) || image?.length > 4) throw ERROR.MAXIMUM_NUMBER_OF_IMAGES;
        if ((image && post.video) || (post.image.length > 0 && video)) throw ERROR.MAXIMUM_NUMBER_OF_IMAGES;

        if (req.body.describe) post.content = req.body.describe;
        if (req.body.status) post.status = req.body.status;

        const image_del = req.body.image_del ? req.body.image_del.split(',') : [];
        image_del.sort().reverse().map((e, i) => post.image.splice(e, 1));

        if (image) {
            if ((post.image?.length ?? 0) + image.length - (image_del.length) > 4)
                throw ERROR.MAXIMUM_NUMBER_OF_IMAGES;

            const image_sort = req.body.image_sort ? req.body.image_sort.split(',') : [];
            console.log(image_sort);

            if (image_sort.length != image.length)
                throw ERROR.PARAMETER_IS_NOT_ENOUGH;

            image_sort.sort().map((e, i) => {
                post.image = [
                    ...post.image.slice(0, e),
                    new File({
                        filename: image[i].filename,
                        url: '/public/uploads/'+image[i].filename
                    }),
                    ...post.image.slice(e)
                ]
            });
        }

        if (video) post.video = new File({
            filename: video.filename,
            url: '/public/uploads/'+video.filename
        });

        await postService.updatePost(post);

        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function deletePost(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);

        if (user._id.toString() != post.author.toString())
            throw ERROR.NOT_ACCESS;

        await postService.deletePost(post);
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function reportPost(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);
        
        const report = {
            post_id: post._id,
            reporter_id: user._id,
            subject: req.body.subject ?? 'Report',
            details: req.body.details ?? 'Reported content'
        }

        await postService.createReport(report);

        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function checkNewItem(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getListVideos(req, res, next) {
    try {
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}


module.exports = {
    getListPosts,
    getPost,
    addPost,
    editPost,
    deletePost,
    reportPost,
    checkNewItem,
    getListVideos
}