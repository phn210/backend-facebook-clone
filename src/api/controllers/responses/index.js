const CODE = require('./codes');

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
    return sendData(res, CODE.isUnknownError(error) ? CODE.ERROR.UNKNOWN_ERROR : error);
}

module.exports = {
    CODE,
    sendData,
    sendError
}

