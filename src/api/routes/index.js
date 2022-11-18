const router = require('express').Router();

const controllers = [
    require('./auth.route'),
    require('./chats.route'),
    require('./comments.route'),
    require('./likes.route'),
    require('./notifications.route'),
    require('./posts.route'),
    require('./searches.route'),
    require('./users.route')
];

router.use('/', controllers);

module.exports = router;