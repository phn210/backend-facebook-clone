const request = require('./requests');
const response = require('./responses');
const jwtService = require('../services/jwt.service');
const friendService = require('../services/friends.service');
const userService = require('../services/users.service');
const env = require('../../lib/env');
const { File } = require('../models/File');
const { ERROR } = require('./responses/code');

async function getUserFriends(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const query = {
            index: req.body.index ? Number(req.body.index) : 0,
            count: req.body.count ? Number(req.body.count) : 20,
            user_id: req.body.user_id ?? user._id.toString()
        }

        const queryUser = await userService.findUserById(query.user_id);
        const friends = await friendService.findUserFriends(queryUser._id, query.index, query.count);
        const friendsDetails = await Promise.all(friends.map(async (e) => {
            const friend_id = e.user1_id.toString() == queryUser._id.toString() ? e.user2_id : e.user1_id;
            const [friend, mutualFriends] = await Promise.all([
                userService.findUserById(friend_id),
                friendService.getMutualFriends(friend_id, user._id)
            ]); 

            return {
                'id': friend._id,
                'username': friend.name,
                'avatar_image': env.app.url+(friend.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg'),
                'mutual_friends': mutualFriends.length,
                'created': e.created_at 
            }
        }));

        response.sendData(res, response.CODE.OK, { 'friends': friendsDetails });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getUserInfo(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        
        const searcherInfo = {
            phone_number: decoded_token.payload.user
        }

        const userInfo = {
            user_id: req.body.user_id
        }

        const [user, searcher] = await Promise.all([
            userService.findUserById(userInfo.user_id),
            userService.findUserByPhoneNumber(searcherInfo.phone_number)
        ]);

        if (user.phone_number == searcher.phone_number) {
            userInfo.is_friend = false;
            
        } else {
            userInfo.is_friend = await friendService.isFriend(user._id, searcher._id);
        }

        const friends = await friendService.getSuggestedFriends(userInfo.user_id);

        response.sendData(res, response.CODE.OK, {
            'id': user._id,
            'username': user.name,
            'created': user.created_at,
            'description': user.described,
            'avatar': env.app.url+(user.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg'),
            'cover': user.cover_image?.url ? env.app.url+user.cover_image?.url : '',
            'link': user._id,
            'address': user.address ?? '',
            'city': user.city ?? '',
            'country': user.country ?? '',
            'num_friends': friends?.length ?? 0,
            'is_friend': userInfo.is_friend,  
            'online': true                          //FIXME
        });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setUserInfo(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);

        const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const avatar = req.files?.avatar ? req.files?.avatar[0] : null;
        const cover = req.files?.cover ? req.files?.cover[0] : null;

        Object.assign(user, {
            name: req.body.user_name ?? user.name,
            described: req.body.description ?? user.described,
            address: req.body.address ?? user.address,
            city: req.body.city ?? user.city,
            country: req.body.country ?? user.country
        })

        if (avatar) user.avatar_image = new File({
            filename: avatar.filename,
            url: '/public/uploads/'+avatar.filename
        });

        if (cover) user.cover_image = new File({
            filename: cover.filename,
            url: '/public/uploads/'+cover.filename
        });
        
        const updatedUser = await userService.updateUser(user);

        response.sendData(res, response.CODE.OK, {
            'id': updatedUser._id,
            'avatar': env.app.url+(updatedUser.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg'),
            'cover': user.cover_image?.url ? env.app.url+updatedUser.cover_image?.url : '',
            'link': updatedUser._id,
            'address': updatedUser.address ?? '',
            'city': updatedUser.city ?? '',
            'country': updatedUser.country ?? ''
        });    
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getListBlocks(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const blocker = await userService.findUserByPhoneNumber(decoded_token.payload.user);

        const blocks = await friendService.getBlocks(blocker._id);

        const victimsDetails = await Promise.all(blocks.map(async (block) => {
            const victim = await userService.findUserById(block.victim_id);
            return {
                'id': victim._id,
                'username': victim.name,
                'avatar': env.app.url+(victim.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg')
            }
        }));

        response.sendData(res, response.CODE.OK, { 'blocks': victimsDetails }); 
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setBlock(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);

        const [blocker, victim] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            userService.findUserById(req.body.user_id)
        ]);

        await friendService.setBlock(blocker._id, victim._id);

        response.sendData(res, response.CODE.OK); 
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setAcceptFriend(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);

        const receiver = await userService.findUserByPhoneNumber(decoded_token.payload.user);
        const sender = await userService.findUserById(req.body.user_id);
        if (!(await friendService.sentFriendRequest(sender._id, receiver._id)))
            throw ERROR.NOT_ACCESS;

        await friendService.createFriend(sender._id, receiver._id);

        response.sendData(res, response.CODE.OK); 
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getRequestedFriends(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const receiver = await userService.findUserByPhoneNumber(decoded_token.payload.user);
        
        const query = {
            index: req.body.index ? Number(req.body.index) : 0,
            count: req.body.count ? Number(req.body.count) : 20
        }

        const requests = await friendService.getFriendRequests(receiver._id, query.index, query.count);

        if (!requests || requests.length == 0)
            response.sendData(res, response.CODE.OK, { 'requests': [] }); 

        const requestsDetails = await Promise.all(requests.map(async (_req) => {
            const [sender, friends] = await Promise.all([
                userService.findUserById(_req.sender_id),
                friendService.getMutualFriends(_req.sender_id, _req.receiver_id)
            ]);
            return {
                'id': sender._id,
                'username': sender.name,
                'avatar_image': env.app.url+(sender.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg'),
                'same_friends': friends.length,
                'created': _req.created_at 
            }
        }));

        console.log(requestsDetails);

        response.sendData(res, response.CODE.OK, { 'requests': requestsDetails }); 
    } catch (error) {
        response.sendError(res, error);
    }
}

async function setRequestFriend(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);

        const sender = await userService.findUserByPhoneNumber(decoded_token.payload.user);
        const receiver = await userService.findUserById(req.body.user_id);
        const newRequest = await friendService.setFriendRequest(sender._id, receiver._id);

        response.sendData(res, response.CODE.OK, {
            'friend_request': newRequest
        }); 
    } catch (error) {
        response.sendError(res, error);
    }
    
}

async function getListSuggestedFriends(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}


module.exports = {
    getUserFriends,
    getUserInfo,
    setUserInfo,
    getListBlocks,
    setBlock,
    setAcceptFriend,
    getRequestedFriends,
    setRequestFriend,
    getListSuggestedFriends
}