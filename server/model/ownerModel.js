const mongoose = require('mongoose')

const ownerSchema = new mongoose.Schema(
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
        companyName: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50,
        },
        role: {
            type: String,
            enum: ["owner"],
            default: "owner"
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

        cars: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Car"
            }
        ],
    },
    { timestamps: true }
);

module.exports = new mongoose.model("Owner", ownerSchema);