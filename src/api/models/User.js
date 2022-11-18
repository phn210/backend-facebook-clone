const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { FileSchema } = require('./File');

const UserSchema = new Schema({
    name: { type: String },                                                 // Name on profile
    phoneNumber: { type: String, required: true },                          // Phone number
    dateLogin: { type: Date },                                              // Latest login timestamp
    registerDate: { type: Date, default: Date.now, required: true },        // Registered timestamp
    password: { type: String, required: true },                             // Hashed password
    verifyCode: { type: String },                                           // Latest verify code
    isVerified: { type: Boolean },                                          // Whether user is verified
    isBlocked: { type: Boolean, default: false },                           // Whether user is blocked ??
    described: { type: String },                                            // Profile's description
    avatarImage: FileSchema,                                                // Avatar image
    coverImage: FileSchema,                                                 // Cover image
    address: { type: String },                                              // Address
    city: { type: String },                                                 // City
    country: { type: String },                                              // Country
    link: { type: String, required: true },                                 // Profile's link
    // timeLastRequestGetVerifyCode: { type: Date }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('User', UserSchema);