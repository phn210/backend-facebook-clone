const mongoose = require('mongoose');

async function connect(url, options) {
    try {
        mongoose.connect(url, options);   
    } catch (error) {
        throw error;
    }
}

module.exports = {
    connect
}