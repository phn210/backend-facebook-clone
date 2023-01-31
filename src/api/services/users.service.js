const sodium = require('libsodium-wrappers');
const mongoose = require('mongoose');

const ERROR = require('../controllers/responses/error');
const User = require('../models/User');

async function createUser(user) {
    if (await checkPhoneNumberExisted(user.phone_number))
        throw ERROR.USER_EXISTED;

    const passwordHash = sodium.crypto_pwhash_str(
        user.password,
        sodium.crypto_pwhash_OPSLIMIT_MIN,
        sodium.crypto_pwhash_MEMLIMIT_MIN
    );
    
    if (!checkValidPassword(passwordHash, user.password))
        throw ERROR.UNKNOWN_ERROR;

    const newUser = new User({
        phone_number: user.phone_number,
        register_date: new Date(),
        password: passwordHash,
        verify_code: user.verify_code,
        last_verify_code_gen: new Date()
    });

    await newUser.save();
    return newUser;
}

function hashPassword(password) {
    return sodium.crypto_pwhash_str(
        password,
        sodium.crypto_pwhash_OPSLIMIT_MIN,
        sodium.crypto_pwhash_MEMLIMIT_MIN
    )
}

async function findUserByPhoneNumber(phone_number) {
    const user = await User.findOne({phone_number: phone_number});
    if (!user) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    return user;
}

async function findUserById(user_id) {
    const user = await User.findById(mongoose.Types.ObjectId(user_id));
    if (!user) throw ERROR.NO_DATA_OR_END_OF_LIST_DATA;
    return user;
}

function checkValidPassword(passwordHash, password) {
    return sodium.crypto_pwhash_str_verify(passwordHash, password);
}

async function checkPhoneNumberExisted(phone_number){
    return (await User.find({phone_number: phone_number})).length > 0;
}

async function updateUser(newUser) {
    let user = await User.findOne({phone_number: newUser.phone_number});
    if (!user) throw ERROR.PARAMETER_VALUE_IS_INVALID;
    user = newUser;
    await user.save();
    return user;
}

module.exports = {
    createUser,
    updateUser,
    hashPassword,
    findUserByPhoneNumber,
    findUserById,
    checkValidPassword
}