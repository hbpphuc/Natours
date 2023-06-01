const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true,
        maxlength: [30, 'A tour name must be less than or equal 50 characters'],
        minlength: [5, 'A user name must be more than or equal 5 characters'],
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    photo: {
        data: String,
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [
            8,
            'A user password must be more than or equal 8 characters',
        ],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must confirm password'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords do not match',
        },
    },
});

userSchema.pre('save', async function (next) {
    // Only run this func if password was actually modified
    if (!this.isModified('password')) {
        console.log('first');
        return next();
    }
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Then delete passwordConfirm
    this.passwordConfirm = undefined;
    console.log('second');
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
