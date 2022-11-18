const responseCodes = require('./codes');

function sendData(res, responseCode, data={}) {
    const content = {
        code: responseCode.body.code,
        message: responseCode.body.message,
        data: data
    }
    return res.status(responseCode.statusCode).send(content);
}

function sendError(res, error) {
    return sendData(res, error);
}

module.exports = {
    responseCodes,
    sendData,
    sendError
}

