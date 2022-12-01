const { getPostById } = require("../services/posts.service")

async function getListPosts(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function getPost(req, res, next) {
    try {
        const id = req.body.id;
        const post = await getPostById(id);
        res.status(200).send({
            code: "1000",
            message: "OK",
            data: {
                id: post._id,
                content: post.content ? post.content : null,
                created: post.created.toString(),
                modified: post.modified.toString(),
                like: post.likedUser.length.toString(),
                comment: post.comments.length.toString(),
                is_liked: user ? (post.likedUser.includes(user._id) ? "1": "0") : "0",
                image: post.image.length > 0 ? post.image.map(image => { return {id: image._id, url: image.url};}) : null,
                video: post.video.url ? {
                    url: post.video.url,
                    thumb: null
                } : null,
                author: post.author ? {
                    id: post.author._id,
                    name: post.author.name ? post.author.name : null,
                    avatar: post.author.avatar.url ? post.author.avatar.url: null
                } : null,
                state: post.status ? post.status : null,
                is_blocked: is_blocked(user, post.author),
                can_edit: can_edit(user, post.author),
                can_comment: "1"
            }
        })
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function addPost(req, res, next) {
    try {
        let user = req.user;
        req.post.author = user.id;
        
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function editPost(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function deletePost(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function reportPost(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function checkNewItem(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function getListVideos(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
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