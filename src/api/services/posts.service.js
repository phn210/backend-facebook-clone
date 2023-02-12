const mongoose = require('mongoose');

const friendService = require('../services/friends.service');
const notificationService = require('../services/notifications.service');
const userService = require('../services/users.service');
const Comment = require('../models/Comment');
const File = require('../models/File');
const Like = require('../models/Like');
const Post = require('../models/Post');
const Report = require('../models/Report');
const ERROR = require('../controllers/responses/error');

async function findOnePost(post_id) {
    const post = await Post.findById(mongoose.Types.ObjectId(post_id));
    if (!post) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    return post;
}

async function getUsersPosts(users_id, last_id=0, index=0, count=20) {
    if (count) {
        return await Post.find({ $and: [ {'author': { $in: users_id }}, {'is_deleted': false}] })
                    .sort('-created_at')
                    .skip(last_id+index*count)
                    .limit(count);
    } else {
        return await Post.find({ $and: [ {'author': { $in: users_id }}, {'is_deleted': false}] }).sort('-created_at');
    }
}

async function getFeedPosts(user_id, last_id=0, index=0, count=20) {
    const userFriends = (await friendService.findUserFriends(user_id, 0, 0)).map(
        friend => (friend.user1_id.toString() == user_id.toString()) ? friend.user2_id.toString() : friend.user1_id.toString()
    );
    userFriends.push(user_id.toString()); // FIXME

    const friendsPosts = await getUsersPosts(userFriends, last_id, index, count);
    let posts = friendsPosts;
    if (posts.length >= count) {
        return posts;
    }
    const allUsers = (await userService.getAllUsers()).map(user => user._id.toString());
    const blockers = (await friendService.getBlockers(user_id)).map(user => user._id.toString());
    const allowed = allUsers.filter(user => (!userFriends.includes(user) && !blockers.includes(user)));
    const new_last_id =  last_id > posts.length ? last_id - posts.length : 0;
    const new_index = (index - Math.floor(friendsPosts.length/count)) < 0 ? 0 : (index - Math.floor(friendsPosts.length/count));
    posts = [...posts, ...(await getUsersPosts(allowed, new_last_id, new_index, count - posts.length))];
    return posts;
}

async function getAllPosts() {
    return await Post.find({'is_deleted': false}).sort('-created_at');
}

async function createPost(post) {
    const newPost = new Post({
        author: post.author,
        content: post.content,
        image: post.image,
        video: post.video,
        status: post.status
    });

    await newPost.save();
    return newPost;
}

async function updatePost(newPost) {
    let post = await Post.findById(newPost._id);
    if (!post) throw ERROR.PARAMETER_VALUE_IS_INVALID;

    post = newPost;
    await post.save();
    return post;
}

async function deletePost(post) {
    let deletedPost = await Post.findById(post._id);
    if (!deletedPost) throw ERROR.PARAMETER_VALUE_IS_INVALID;
    if (deletedPost.is_deleted) throw ERROR.ACTION_HAS_BEEN_DONE_PREVIOUSLY_BY_THIS_USER;

    deletedPost.modified += 1;
    deletedPost.is_deleted = true;
    await deletedPost.save();
}

async function findOneReport(report_id) {
    return await Report.findById(report_id);
}

async function isReported(post_id, reporter_id) {
    return !(!(await Report.findOne({
        $and: [ {'post_id': post_id}, {'reporter_id': reporter_id} ]
    })));
}

async function createReport(report) {
    if (await isReported(report.post_id, report.reporter_id))
        throw ERROR.ACTION_HAS_BEEN_DONE_PREVIOUSLY_BY_THIS_USER;

    const newReport = new Report({
        post_id: report.post_id,
        reporter_id: report.reporter_id,
        subject: report.subject,
        details: report.details
    })

    await newReport.save();
    return newReport;
}

async function findOneLike(like_id) {
    return await Like.findById(like_id);
}

async function isLiked(user_id, post_id) {
    return !(!(await Like.findOne({
        $and: [ {'user_id': user_id}, {'post_id': post_id} ]
    })));
}

async function toggleLike(user_id, post_id) {
    if (await isLiked(user_id, post_id)) {
        return await deleteLike(user_id, post_id);
    } else {
        return await createLike(user_id, post_id);
    }
}

async function createLike(user_id, post_id) {
    const like = new Like({
        user_id: user_id,
        post_id: post_id
    })

    await like.save();
    return [like, true];
}

async function deleteLike(user_id, post_id) {
    const like = await Like.findOne({
        $and: [ {'user_id': user_id}, {'post_id': post_id} ]
    });

    if (!like) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    await like.remove();
    return [like, false];
}

async function getPostLikes(post_id) {
    return await Like.find({ 'post_id': post_id });
}

async function findOneComment(comment_id) {
    return await Comment.findById(comment_id);
}

async function getPostComments(post_id, index=0, count=20) {
    if (count) {
        return await Comment.find({ 'post_id': post_id })
                    .sort('-created_at')
                    .skip(index*count)
                    .limit(count);
    } else {
        return await Comment.find({ 'post_id': post_id }).sort('-created_at');
    }
}

async function createComment(comment) {
    const newComment = new Comment({
        post_id: comment.post_id,
        author_id: comment.author_id,
        comment: comment.comment
    })

    await newComment.save();
    return newComment;
}

module.exports = {
    findOnePost,
    getUsersPosts,
    getFeedPosts,
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    findOneReport,
    createReport,
    findOneLike,
    isLiked,
    toggleLike,
    getPostLikes,
    findOneComment,
    getPostComments,
    createComment
}