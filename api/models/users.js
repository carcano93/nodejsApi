const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    hash: String,
    salt: String, 
});

schema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
}

schema.methods.validatePassw = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

schema.methods.generateJWT = function()  {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign({
        _id: this._id,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000, 10)
    }, process.env.JWT_SECRET)
}

mongoose.model('Users', schema);




