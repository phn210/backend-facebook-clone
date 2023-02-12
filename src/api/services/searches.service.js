const mongoose = require('mongoose');

const ERROR = require('../controllers/responses/error');
const friendService = require('../services/friends.service');
const postService = require('../services/posts.service');
const userService = require('../services/users.service');
const Search = require('../models/Search');
const { removeAccent, split2Words } = require('../../lib/utils');

const fullStringFilter = (content, keyword) => {
    return content.includes(keyword);
}

const fullKeywordFilter = (content, keyword) => {
    let keywords = split2Words(keyword);
    let filter = keywords.map(word => content.includes(word));
    return !filter.includes(false);
}

const minimumKeywordFilter = (content, keyword) => {
    let keywords = split2Words(keyword);
    let filter = keywords.map(word => content.includes(word));
    return filter.filter(e => e).length/keywords.length >= 0.2;
}

async function searchPosts(user_id, keyword, searcher_id, index=0, count=20) {
    let posts = !user_id
                ? await postService.getAllPosts()
                : await postService.getUsersPosts([mongoose.Types.ObjectId(user_id)]);

    await createSavedSearch(keyword, searcher_id);

    keyword = removeAccent(keyword);

    const fullStringPosts = posts.filter(post => fullStringFilter(removeAccent(post.content), keyword));
    
    const fullKeywordPosts = posts.filter(post => (
        !fullStringFilter(removeAccent(post.content), keyword) && 
        fullKeywordFilter(removeAccent(post.content), keyword)
    ));

    const minimumKeywordPosts = posts.filter(post => (
        !fullStringFilter(removeAccent(post.content), keyword) && 
        !fullKeywordFilter(removeAccent(post.content), keyword) &&
        minimumKeywordFilter(removeAccent(post.content), keyword)
    ));

    let result = fullStringPosts.slice(index*count, (index+1)*count);
    
    if (result.length < count) result = [
        ...result,
        ...fullKeywordPosts.slice(
            index*count >= fullStringPosts.length ? (index*count - fullStringPosts.length) : 0,
            index*count >= fullStringPosts.length ? ((index+1)*count - fullStringPosts.length) : (count - result.length)
        )
    ]

    if (result.length < count) result = [
        ...result,
        ...minimumKeywordPosts.slice(
            index*count >= minimumKeywordPosts.length ? (index*count - fullStringPosts.length - fullKeywordPosts.length) : 0,
            index*count >= minimumKeywordPosts.length ? ((index+1)*count - fullStringPosts.length  - fullKeywordPosts.length) : (count - result.length)
        )
    ]

    return result.slice(0, count);
}

async function searchUsers(keyword, searcher_id, index=0, count=20) {
    const friends = await friendService.findUserFriends(searcher_id);
    const allUsers = await userService.getAllUsers();

    const friendIds = friends.map(friend => (friend.user1_id.toString() == searcher_id.toString()) ? friend.user2_id.toString() : friend.user1_id.toString());
    const blockerIds = (await friendService.getBlockers(searcher_id)).map(block => block.blocker_id.toString());
    const users = allUsers.filter(user => !blockerIds.includes(user._id.toString()) || friendIds.includes(user._id));

    keyword = removeAccent(keyword);

    const fullStringUsers = users.filter(user => fullStringFilter(removeAccent(user.name ?? ''), keyword));
    
    const fullKeywordUsers = users.filter(user => (
        !fullStringFilter(removeAccent(user.name ?? ''), keyword) && 
        fullKeywordFilter(removeAccent(user.name ?? ''), keyword)
    ));

    const minimumKeywordUsers = users.filter(user => (
        !fullStringFilter(removeAccent(user.name ?? ''), keyword) && 
        !fullKeywordFilter(removeAccent(user.name ?? ''), keyword) &&
        minimumKeywordFilter(removeAccent(user.name ?? ''), keyword)
    ));

    let result = fullStringUsers.slice(index*count, (index+1)*count);
    
    if (result.length < count) result = [
        ...result,
        ...fullKeywordUsers.slice(
            index*count >= fullStringUsers.length ? (index*count - fullStringUsers.length) : 0,
            index*count >= fullStringUsers.length ? ((index+1)*count - fullStringUsers.length) : (count - result.length)
        )
    ]

    if (result.length < count) result = [
        ...result,
        ...minimumKeywordUsers.slice(
            index*count >= (fullStringUsers.length + fullKeywordUsers.length) ? (index*count - fullStringUsers.length - fullKeywordUsers.length) : 0,
            index*count >= (fullStringUsers.length + fullKeywordUsers.length) ? ((index+1)*count - fullStringUsers.length  - fullKeywordUsers.length) : (count - result.length)
        )
    ]

    return result.slice(0, count);
}

async function getSavedSearches(user_id, index=0, count=20) {
    if (count) {
        return await Search.find({ 'user_id': user_id })
                    .sort('-updated_at')
                    .skip(index*count)
                    .limit(count);
    } else {
        return await Search.find({ 'user_id': user_id }).sort('-updated_at');
    }
}

async function createSavedSearch(keyword, user_id) {
    let search = await Search.findOne({
        $and: [ {'user_id': user_id}, {'keyword': keyword} ]
    });
    if(!search) {
        search = new Search({
            user_id: user_id,
            keyword: keyword
        });
    }
    search['updated_at'] = new Date();
    await search.save();
}

async function deleteSavedSearch(user_id, search_id, all) {
    if (!user_id && search_id == '') throw ERROR.PARAMETER_IS_NOT_ENOUGH;
    if (all && search_id == '') {
        await Search.deleteMany({'user_id': user_id});
    } else if (!all && search_id != '') {
        const search = await Search.findById(mongoose.Types.ObjectId(search_id));
        if(!search) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
        await search.remove();
    } else throw ERROR.PARAMETER_VALUE_IS_INVALID;
}

module.exports = {
    searchPosts,
    searchUsers,
    getSavedSearches,
    createSavedSearch,
    deleteSavedSearch
}