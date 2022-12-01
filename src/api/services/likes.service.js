const Like = require('../models/Like');
const assert = require('assert');

async function createLike(like){
    try {
        const newLike = await Like.save({
            user_id: like.userId,
            post_id: like.postId,
        });
        return newLike;
    } catch (error) {
        throw error;
    }
}

async function getLikesByPostId(postId){
    try {
        const likes = Like.find({post_id: postId});
        return likes;
    } catch (error) {
        throw error;
    }
}