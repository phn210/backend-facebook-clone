const Post = require('../models/Post');
const assert = require('assert');
const {getLikesByPostId} = require('../services/likes.service')

async function createPost(post) {
    try {
        const newPost = await Post.save({
            author: post.author,
            content: post.content,
            image: post.image,
            video: post.video
        });

        return newPost;
    } catch (error) {
        throw error;
    }
}

async function getPostById(id) {
    try {
        const post = await Post.findById(id);
        const likes = await getLikesByPostId()
        return post;
    } catch (error) {
        throw error;
    }
}

async function updatePost(post) {

}

async function softDeletePost(id) {
    try {
        const post = await Post.findByIdAndUpdate(id, {is_deleted: true}, {new: true})
        return post;
    } catch (error) {
        throw error;
    }
}

async function hardDeletePost(id) {
    try {
        const post = await Post.findById(id);

        assert(post.is_deleted == true);

        await Post.deleteOne({id: id});

        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getPostById
}