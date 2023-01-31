const request = require('./requests');
const response = require('./responses');
const ERROR = require('./responses/error');
const jwtService = require('../services/jwt.service');
const postService = require('../services/posts.service');
const userService = require('../services/users.service');

async function like(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        const [user, post] = await Promise.all([
            userService.findUserByPhoneNumber(decoded_token.payload.user),
            postService.findOnePost(req.body.id)
        ]);
        
        const like = await postService.toggleLike(user._id, post._id);
        console.log(like);
        response.sendData(res, response.CODE.OK, { 'like': like });
    } catch (error) {
        response.sendError(res, error);
    }
}

module.exports = {
    like
}
