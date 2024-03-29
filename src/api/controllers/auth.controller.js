const request = require('./requests');
const response = require('./responses');
const ERROR = require('../controllers/responses/error');
const userService = require('../services/users.service');
const jwtService = require('../services/jwt.service');
const firebaseService = require('../services/firebase-messaging.service');
const { File } = require('../models/File');
const env = require('../../lib/env');

function newVerifyCode() {
    return Math.floor(Math.random()*1000000);
}

async function signup(req, res, next) {
    try {
        const user = {
            phone_number: req.body.phone_number,
            password: req.body.password,
            verify_code: newVerifyCode(),
            device_token: req.body.device_token
        }
        if (!(request.isPhoneNumber(user.phone_number)))
            throw ERROR.PARAMETER_VALUE_IS_INVALID;

        const newUser = await userService.createUser(user);
        
        response.sendData(res, response.CODE.OK, {
            'verify_code': newUser.verify_code
        });

        if (user.device_token && user.device_token != '') {
            await firebaseService.upsertFirebaseToken(newUser._id, user.device_token)

            firebaseService.sendPushNotification(newUser.id, {
                title: 'IT4788 Facebook',
                body: `Your verification code is ${newUser.verify_code}`,
                data: {'verify_code': newUser.verify_code}
            });
        }
    } catch (error) {
        response.sendError(res, error);
    }
}

async function login(req, res, next) {
    try {
        const loginInfo = {
            phone_number: req.body.phone_number,
            password: req.body.password,
            device_token: req.body.device_token
        }
        const user = await userService.findUserByPhoneNumber(loginInfo.phone_number);
        
        if (userService.checkValidPassword(user.password, loginInfo.password)) {
            console.log('token',loginInfo.device_token);
            
            response.sendData(res, response.CODE.OK, {
                'id': user._id,
                'username': user.name ?? '',
                'token': jwtService.sign(jwtService.generatePayload(user)),
                'avatar': env.app.url+(user.avatar_image?.url ?? '/public/assets/img/avatar-default.jpg')
            });

            if (loginInfo.device_token && loginInfo.device_token != '') {
                await firebaseService.upsertFirebaseToken(user._id, loginInfo.device_token)
    
                firebaseService.sendPushNotification(user.id, {
                    title: 'IT4788 Facebook',
                    body: `Welcome back`,
                    data: {}
                });
            }
        } else {
            response.sendError(res, response.CODE.ERROR.PARAMETER_VALUE_IS_INVALID);
        }
    } catch (error) {
        response.sendError(res, error);
    }
}

async function logout(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;

        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
    }
}

async function getVerifyCode(req, res, next) {
    try {
        const verify_code_request = {
            phone_number: req.body.phone_number,
            verify_code: newVerifyCode()
        }
        const user = await userService.findUserByPhoneNumber(verify_code_request.phone_number);
        if ((new Date()).getTime() - user.last_verify_code_gen.getTime() < 120000)
            throw ERROR.ACTION_HAS_BEEN_DONE_PREVIOUSLY_BY_THIS_USER;

        user.verify_code = verify_code_request.verify_code;
        user.last_verify_code_gen = new Date();

        const updatedUser = await userService.updateUser(user);

        response.sendData(res, response.CODE.OK, {
            'verify_code': updatedUser.verify_code
        });

        firebaseService.sendPushNotification(updatedUser.id, {
            title: 'IT4788 Facebook',
            body: `Your verification code is ${updatedUser.verify_code}`,
            data: {'verify_code': updatedUser.verify_code}
        });
    } catch (error) {
        response.sendError(res, error);
    }
}

async function checkVerifyCode(req, res, next) {
    try {
        const verify_request = {
            phone_number: req.body.phone_number,
            verify_code: req.body.verify_code
        }
        const user = await userService.findUserByPhoneNumber(verify_request.phone_number);

        if (user.is_verified)
            throw ERROR.ACTION_HAS_BEEN_DONE_PREVIOUSLY_BY_THIS_USER
        
        if (user.verify_code != verify_request.verify_code)
            throw ERROR.CODE_VERIFY_IS_INCORRECT
        
        user.is_verified = true
        const updatedUser = await userService.updateUser(user);

        response.sendData(res, response.CODE.OK, {
            'id': updatedUser._id,
            'is_verified': updatedUser.is_verified
        })
    } catch (error) {
        response.sendError(res, error);
    }
}

async function changeInfoAfterSignUp(req, res, next) {
    try {
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        
        const userInfo = {
            phone_number: decoded_token.payload.user,
            name: req.body.username ?? null,
            avatar: req.files.avatar ? req.files.avatar[0] : null,
            cover: req.files.cover ? req.files.cover[0] : null
        }
        const user = await userService.findUserByPhoneNumber(userInfo.phone_number);

        if (!user.is_verified)
            throw ERROR.USER_IS_NOT_VALIDATED;

        if (userInfo.name != null && userInfo.name != '') user.name = userInfo.name;

        if (userInfo.avatar != null) {
            user.avatar_image = new File({
                filename: userInfo.avatar.filename,
                url: '/public/uploads/'+userInfo.avatar.filename
            })
        } else if (!user.avatar_image){
            user.avatar_image = new File({
                filename: 'avatar-default.jpg',
                url: '/public/assets/img/avatar-default.jpg'
            })
        }

        if (userInfo.cover != null) {
            user.cover_image = new File({
                filename: userInfo.cover.filename,
                url: '/public/uploads/'+userInfo.cover.filename
            })
        } else if (!user.cover_image){
            user.cover_image = new File({
                filename: 'cover-default.jpg',
                url: '/public/assets/img/cover-default.jpg'
            })
        }

        const updatedUser = await userService.updateUser(user);

        response.sendData(res, response.CODE.OK, {
            'id': updatedUser._id,
            'username': updatedUser.name,
            'phone_number': updatedUser.phone_number,
            'created_at': updatedUser.created_at,
            'avatar': env.app.url+updatedUser.avatar_image.url,
            'cover': env.app.url+updatedUser.cover_image.url
        })
    } catch (error) {
        response.sendError(res, error);
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
        const token = req.body.token;
        if (!jwtService.verify(token))
            throw ERROR.TOKEN_IS_INVALID;
        const decoded_token = jwtService.decode(token);
        
        const userInfo = {
            phone_number: decoded_token.payload.user,
            password: req.body.password,
            new_password: req.body.new_password
        }

        const user = await userService.findUserByPhoneNumber(userInfo.phone_number);
        
        if (!userService.checkValidPassword(user.password, userInfo.password))
            throw ERROR.PARAMETER_VALUE_IS_INVALID;

        if (userInfo.password == userInfo.new_password)
            throw ERROR.PARAMETER_VALUE_IS_INVALID;

        user.password = userService.hashPassword(userInfo.new_password);
        const updatedUser = await userService.updateUser(user);
        response.sendData(res, response.CODE.OK);
    } catch (error) {
        response.sendError(res, error);
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