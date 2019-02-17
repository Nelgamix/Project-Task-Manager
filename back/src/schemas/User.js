const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:           { type: String, unique: true },
    displayName:    String,
    email:          String,
    role:           String,
    created:        { type: Date, default: Date.now },
    lastLogin:      { type: Date, default: Date.now },
    password:       String,
});

userSchema.methods.validatePassword = function(pass, cb) {
    bcrypt.compare(pass, this.password, (err, res) => {
        cb(res);
    });
};

userSchema.statics.getPasswordHash = function(pass, cb) {
    bcrypt.hash(pass, 10, (err, hash) => {
        cb(hash);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
