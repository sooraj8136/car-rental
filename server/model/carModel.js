const mongoose = require("mongoose");

const carModel = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: Number,
            required: true,
            min: 1900,
            max: new Date().getFullYear(),
        },
        color: {
            type: String,
            required: true,
        },
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        fuelType: {
            type: String,
            enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
            required: true,
        },
        transmission: {
            type: String,
            enum: ["Manual", "Automatic"],
            required: true,
        },
        seats: {
            type: Number,
            required: true,
            min: 2,
            max: 10,
        },
        rentalPricePerDay: {
            type: Number,
            required: true,
            min: 0,
        },
        images: {
            type: [String],
            default: [
                "https://www.autoshippers.co.uk/blog/wp-content/uploads/bugatti-centodieci.jpg"
            ]
        },
        description: {
            type: String,
            maxlength: 500,
        },
        category: {
            type: String,
            required: true,
            enum: ["SUV", "Sedan", "Hatchback", "Convertible", "Coupe", "Truck", "Van", "Other", "Sports"],
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        features: {
            type: [String],
            default: ["360 Camera", "GPS", "Bluetooth", "Heated Seats"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Car", carModel);
