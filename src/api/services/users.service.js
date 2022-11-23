const sodium = require('libsodium-wrappers');
const assert = require('assert');

const User = require('../models/User');

async function createUser(user) {
    try {
        const passwordHash = sodium.crypto_pwhash_str(
            user.password,
            sodium.crypto_pwhash_OPSLIMIT_MIN,
            sodium.crypto_pwhash_MEMLIMIT_MIN
        );

        assert(sodium.crypto_pwhash_str_verify(passwordHash, user.password));

        const newUser = await User.save({
            phone_number: user.phonenumber,
            date_login: new Date(),
            register_date: new Date(),
            password: passwordHash
        });

        return newUser;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser
}