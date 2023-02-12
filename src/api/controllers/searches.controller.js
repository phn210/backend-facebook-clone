const request = require('./requests');
const response = require('./responses');
const ERROR = require('./responses/error');
const jwtService = require('../services/jwt.service');
const friendService = require('../services/friends.service');
const postService = require('../services/posts.service');
const searchService = require('../services/searches.service');
const userService = require('../services/users.service');
const env = require('../../lib/env');

async function search(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const searcher = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const query = {
            keyword: req.body.keyword ?? '',
            user_id: req.body.user_id ?? null,
            index: req.body.index ? Number(req.body.index) : 0,
            count: req.body.count ? Number(req.body.count) : 20,
            type: req.body.type ?? 'post'
        }

        let results, details;

        if (type == 'post') {
            results = await searchService.searchPosts(
                query.user_id,
                query.keyword,
                searcher._id,
                query.index,
                query.count
            );

            details = await Promise.all(results.map(async (post) => {
                const [likes, comments, isLiked, author, isBlocked] = await Promise.all([
                    postService.getPostLikes(post._id),
                    postService.getPostComments(post._id),
                    postService.isLiked(searcher._id, post._id),
                    userService.findUserById(post.author),
                    friendService.isBlock(post.author, searcher._id)
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
                        'avatar': env.app.url+(author.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg')
                    }
                }
            }))
        } else if (type == 'user') {
            results = await searchService.searchUsers(
                query.keyword,
                searcher._id,
                query.index,
                query.count
            );

            details = await Promise.all(results.map(async (user) => {
                const friends = await friendService.getMutualFriends(user._id, searcher._id)
    
                return {
                    'id': user._id,
                    'username': user.name,
                    'avatar_image': env.app.url+(sender.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg'),
                    'same_friends': friends.length
                }
            }))
        } else throw ERROR.PARAMETER_VALUE_IS_INVALID;

        response.sendData(res, response.CODE.OK, details);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getSavedSearch(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const query = {
            index: req.body.index ? Number(req.body.index) : 0,
            count: req.body.count ? Number(req.body.count) : 20
        }

        const searches = await searchService.getSavedSearches(user._id, query.index, query.count);
        const results = searches.map(search => {return {
            'id': search._id,
            'keyword': search.keyword,
            'created': search.created_at
        }});

        response.sendData(res, response.CODE.OK, results);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function delSavedSearch(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const query = {
            search_id: req.body.search_id ?? '',
            all: req.body.all ? Number(req.body.all) : 0
        }

        await searchService.deleteSavedSearch(user._id.toString(), query.search_id, query.all);
        response.sendData(res, response.CODE.OK, {});
    } catch (error) {
        response.sendError(res, error);
    }
}


module.exports = {
    search,
    getSavedSearch,
    delSavedSearch
}
