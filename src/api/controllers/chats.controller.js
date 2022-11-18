async function getConversation(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function getListConversation(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function deleteConversation(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function setReadMessage(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}

async function deleteMessage(req, res, next) {
    try {
        res.send({'test': 'OK'})
    } catch (error) {
        res.status(500).send({'error': 'ERROR'})
    }
}


module.exports = {
    getConversation,
    deleteMessage,
    getListConversation,
    deleteConversation,
    setReadMessage
}