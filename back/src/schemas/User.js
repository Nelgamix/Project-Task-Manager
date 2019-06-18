const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:           { type: String, unique: true },
    displayName:    String,
    email:          String,
    image:          String,
    role:           String,
    created:        { type: Date, default: Date.now },
    lastLogin:      { type: Date, default: Date.now },
    password:       String, // Hash of the password
});

userSchema.methods.validatePassword = function(pass, cb) {
    bcrypt.compare(pass, this.password)
        .then((res) => {
            cb(res);
        })
        .catch((err) => {
            cb(null);
        });
};

userSchema.statics.getPasswordHash = function(pass, cb) {
    bcrypt.hash(pass, 10)
        .then((hash) => {
            cb(hash);
        })
        .catch((err) => {
            cb(null);
        });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
