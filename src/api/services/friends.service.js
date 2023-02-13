const mongoose = require('mongoose');

const ERROR = require('../controllers/responses/error');
const Block = require('../models/Block');
const Friend = require('../models/Friend');
const FriendRequest = require('../models/FriendRequest');

async function findOneFriend(friend_id) {
    return await Friend.findById(friend_id);
}

async function findUserFriends(user_id, index=0, count=20) {
    if (count) {
        return await Friend.find({
            $or: [
                { 'user1_id': user_id },
                { 'user2_id': user_id }
            ]
        })
        .sort('-created_at')
        .skip(index*count)
        .limit(count);
    } else {
        return await Friend.find({
            $or: [
                { 'user1_id': user_id },
                { 'user2_id': user_id }
            ]
        }).sort('-created_at');
    }
}

async function isFriend(user1_id, user2_id) {
    return !(!(await Friend.findOne({
        $or: [
            { $and: [ {'user1_id': user1_id}, {'user2_id': user2_id} ] },
            { $and: [ {'user1_id': user2_id}, {'user2_id': user1_id} ] },
        ]
    })));
}

async function createFriend(user1_id, user2_id) {
    if (await isFriend(user1_id, user2_id))
        throw ERROR.ACTION_HAS_BEEN_DONE_PREVIOUSLY_BY_THIS_USER;

    const [user1Friends, user2Friends] = await Promise.all([
        findUserFriends(user1_id), findUserFriends(user2_id)
    ]);
    
    if (user1Friends?.length >= 500 || user2Friends?.length >= 500)
        throw ERROR.NOT_ACCESS;

    const newFriend = new Friend({
        user1_id: user1_id,
        user2_id: user2_id
    });

    await newFriend.save();
    await deleteFriendRequest(user1_id, user2_id);
    return newFriend;
}

async function deleteFriend(user1_id, user2_id) {
    const friend = await Friend.findOne({
        $or: [
            { $and: [ {'user1_id': user1_id}, {'user2_id': user2_id} ] },
            { $and: [ {'user1_id': user2_id}, {'user2_id': user1_id} ] },
        ]
    });
    if (!friend) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;

    await friend.remove();
    return {};
}

async function findOneRequest(request_id) {
    return await FriendRequest.findById(request_id);
}

async function sentFriendRequest(sender_id, receiver_id) {
    return !(!(await FriendRequest.findOne({
        $and: [ {'sender_id': sender_id}, {'receiver_id': receiver_id} ]
    })));
}

async function getFriendRequests(user_id, index=0, count=20) {
    if (count) {
        return await FriendRequest.find({ 'receiver_id': user_id })
                    .sort('-created_at')
                    .skip(index*count)
                    .limit(count);
    } else {
        return await FriendRequest.find({ 'receiver_id': user_id }).sort('-created_at');
    }
}

async function setFriendRequest(sender_id, receiver_id) {
    if (sender_id.toString() == receiver_id.toString())
        throw ERROR.PARAMETER_VALUE_IS_INVALID;
        
    if (await isFriend(sender_id, receiver_id))
        throw ERROR.ACTION_HAS_BEEN_DONE_PREVIOUSLY_BY_THIS_USER;
    
    if (await sentFriendRequest(sender_id, receiver_id)) {
        return await deleteFriendRequest(sender_id, receiver_id);
    } else if (await sentFriendRequest(receiver_id, sender_id)) {
        throw ERROR.ACTION_HAS_BEEN_DONE_PREVIOUSLY_BY_THIS_USER;
    } else {
        return await createFriendRequest(sender_id, receiver_id);
    }
}

async function createFriendRequest(sender_id, receiver_id) {    
    const newRequest = new FriendRequest({
        sender_id: sender_id,
        receiver_id: receiver_id
    });

    await newRequest.save();
    return newRequest;
}

async function deleteFriendRequest(sender_id, receiver_id) {
    const request = await FriendRequest.findOne({
        $and: [ {'sender_id': sender_id}, {'receiver_id': receiver_id} ]
    });

    if (!request) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    await request.remove();
    return {};
}

async function getSuggestedFriends(user_id, index=0, count=20) {

}

async function getMutualFriends(user1_id, user2_id) {
    let [user1Friends, user2Friends] = await Promise.all([
        findUserFriends(user1_id), findUserFriends(user2_id)
    ]);

    user1Friends = user1Friends.map(friend => (friend.user1_id.toString() == user1_id.toString()) ? friend.user2_id.toString() : friend.user1_id.toString());

    user2Friends = user2Friends.map(friend => (friend.user1_id.toString() == user2_id.toString()) ? friend.user2_id.toString() : friend.user1_id.toString());

    const mutualFriends = user1Friends.filter(friend => user2Friends.includes(friend));
    return mutualFriends;
}

async function findOneBlock(block_id) {
    return await Block.findById(block_id);
}

async function getBlocks(user_id, index=0, count=20) {
    if (count) {
        return await Block.find({ blocker_id: user_id })
                    .sort('-created_at')
                    .skip(index*count)
                    .limit(count);
    } else {
        return await Block.find({ blocker_id: user_id }).sort('-created_at');
    }
}

async function getBlockers(user_id) {
    return await Block.find({ 'victim_id': mongoose.Types.ObjectId(user_id) });
} 

async function isBlock(blocker_id, victim_id) {
    return !(!(await Block.findOne({
        $and: [ {'blocker_id': blocker_id}, {'victim_id': victim_id} ]
    })));
}

async function setBlock(blocker_id, victim_id) {
    if (blocker_id.toString() == victim_id.toString())
        throw ERROR.PARAMETER_VALUE_IS_INVALID;

    if (await isBlock(blocker_id, victim_id))
        await deleteBlock(blocker_id, victim_id);
    else await createBlock(blocker_id, victim_id);
}

async function createBlock(blocker_id, victim_id) {
    const newBlock = new Block({
        blocker_id: blocker_id,
        victim_id: victim_id
    });

    await newBlock.save();
    if (await isFriend(blocker_id, victim_id)) await deleteFriend(blocker_id, victim_id);
    return newBlock;
}

async function deleteBlock(blocker_id, victim_id) {
    const block = await Block.findOne({
        $and: [ {'blocker_id': blocker_id}, {'victim_id': victim_id} ]
    });

    if (!block) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    await block.remove();
    return {};
}

module.exports = {
    findOneFriend,
    findUserFriends,
    isFriend,
    createFriend,
    deleteFriend,
    findOneRequest,
    getFriendRequests,
    sentFriendRequest,
    setFriendRequest,
    getSuggestedFriends,
    getMutualFriends,
    findOneBlock,
    getBlocks,
    getBlockers,
    isBlock,
    setBlock
}