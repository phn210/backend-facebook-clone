const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { FileSchema } = require('./File');

const UserSchema = new Schema({
    phone_number: { type: String, required: true },                         // Latest login timestamp
    register_date: { type: Date, default: new Date(), required: true },     // Registered timestamp
    password: { type: String, required: true },                             // Hashed password
    verify_code: { type: String, required: true },
    last_verify_code_gen: { type: Date, required: true },
    is_verified: { type: Boolean, default: false },                         // Whether user is verified
    is_blocked: { type: Boolean, default: false },                          // Whether user is blocked ??
    name: { type: String },                                                 // Name on profile
    described: { type: String },                                            // Profile's description
    avatar_image: FileSchema,                                               // Avatar image
    cover_image: FileSchema,                                                // Cover image
    address: { type: String },                                              // Address
    city: { type: String },                                                 // City
    country: { type: String },                                              // Country
    link: { type: String },                                                 // Profile's link
    roles: { type: [String] }
    // timeLastRequestGetVerifyCode: { type: Date }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    strictQuery: false
});

module.exports = mongoose.model('User', UserSchema);