const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
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
            maxlength: 15,
        },
        role: {
            type: String,
            enum: ["admin", "owner"],
            default: 'admin'
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
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

        // products: [{ type: mongoose.Types.ObjectId, ref: "products" }],
    },
    { timestamps: true }
);

module.exports = new mongoose.model("Admin", adminSchema);