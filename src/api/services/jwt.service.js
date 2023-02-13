const jwt = require('jsonwebtoken');
const env = require('../../lib/env');

function generatePayload(user) {
    return {
        'user': user.phone_number,
        'roles': user.roles
    }
}

function sign(payload) {
    return jwt.sign(payload, env.jwt.privateKey, env.jwt.options);
}

function verify(token) {
    try {
        return jwt.verify(token, env.jwt.publicKey, env.jwt.options);
    } catch (error) {
        return false;
    }
}

function decode(token) {
    return jwt.decode(token, { complete: true });
}

module.exports = {
    generatePayload,
    sign,
    verify,
    decode
}