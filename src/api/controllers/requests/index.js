function isPhoneNumber(phoneNumber) {
    return (phoneNumber.search(/0{1}/) == 0)
        && (phoneNumber.match(/^\d{10}$/) != null);
}

function validatePassword(password) {
    return true; //!FIXME
}

function validateUsername(username) {
    return true; //!FIXME
}

module.exports = {
    isPhoneNumber
}