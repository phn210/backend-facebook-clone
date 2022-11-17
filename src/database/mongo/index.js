const mongoose = require('mongoose');

module.exports = async function connect(url, options) {
    try {
        mongoose.connect(url, options);   
    } catch (error) {
        throw error;
    }
}