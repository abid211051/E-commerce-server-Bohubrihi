const { Schema, model } = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 100
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        minlength: 6,
    },
    googleid: {
        type: String
    },
    facebookid: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role,
        name: this.name
    }, process.env.JWT_KEY, { expiresIn: '2h' });

    return token;
}

module.exports.User = model('User', userSchema);