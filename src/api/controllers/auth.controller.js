const response = require('./responses');
const userService = require('../services/users.service');

async function signup(req, res, next) {
    try {
        const user = {
            phone_number: req.body.phone_number,
            password: req.body.password
        }
        const newUser = await userService.createUser(user);

        response.sendData(res, response.CODE.OK, newUser);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function login(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function logout(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function getVerifyCode(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function checkVerifyCode(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function changeInfoAfterSignUp(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function setDevToken(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function changePassword(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}


module.exports = {
    login,
    logout,
    signup,
    getVerifyCode,
    checkVerifyCode,
    changePassword,
    changeInfoAfterSignUp,
    setDevToken
}