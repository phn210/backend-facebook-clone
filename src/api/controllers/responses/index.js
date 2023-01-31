const CODE = require('./code');

function sendData(res, responseCode, data={}) {
    const content = {
        code: responseCode.body.code,
        message: responseCode.body.message,
        data: data
    }
    return res.status(responseCode.statusCode).send(content);
}

function sendError(res, error) {
    console.error(error);
    return sendData(res, CODE.ERROR.isUnknownError(error) ? CODE.ERROR.EXCEPTION_ERROR : error);
}

module.exports = {
    CODE,
    sendData,
    sendError
}

