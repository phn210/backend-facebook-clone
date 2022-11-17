const router = require('express').Router();

const controllers = [
    require('./auth'),
    require('./chat'),
    require('./comments'),
    require('./likes'),
    require('./notifications'),
    require('./posts'),
    require('./search'),
    require('./users')
];

router.use('/', controllers);

module.exports = router;