const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            minlength: 10,
            maxlength: 10,
        },
        password: {
            type: String,
            required: true,
            minlength: [8, 'Password must be at least 8 characters long']
        },
        profilePic: {
            type: String,
            default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        resetToken: {
            type: String
        },
        resetTokenExpires: {
            type: Date
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema); 
