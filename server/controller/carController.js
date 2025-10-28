const { cloudinaryInstance } = require('../config/cloudinaryConfig');
const OwnerDb = require('../model/ownerModel')
const BookingDb = require('../model/bookingModel')
const CarDb = require('../model/carModel')

// const createCar = async (req, res) => {
//     try {
//         const {
//             brand,
//             model,
//             year,
//             color,
//             registrationNumber,
//             fuelType,
//             transmission,
//             seats,
//             rentalPricePerDay,
//             description,
//             category,
//             location
//         } = req.body;

//         const ownerId = req.user.id;

//         console.log("Logged-in Owner ID:", ownerId);
//         console.log("Request Body =", req.body);
//         console.log("Uploaded Files =", req.files);

//         if (
//             !brand || !model || !year || !color || !registrationNumber ||
//             !fuelType || !transmission || !seats || !rentalPricePerDay || !category || !location
//         ) {
//             return res.status(400).json({ message: "All required fields must be filled." });
//         }

//         const imageUrls = [];

//         for (const file of req.files) {
//             const uploadResult = await cloudinaryInstance.uploader.upload(file.path);
//             imageUrls.push(uploadResult.secure_url);
//         }

//         const newCar = new CarDb({
//             brand,
//             model,
//             year,
//             color,
//             registrationNumber,
//             fuelType,
//             transmission,
//             seats,
//             rentalPricePerDay,
//             description,
//             category,
//             location,
//             images: imageUrls,
//             owner: ownerId,
//         });

//         const savedCar = await newCar.save();

//         await OwnerDb.findByIdAndUpdate(
//             ownerId,
//             { $push: { cars: savedCar._id } },
//             { new: true }
//         );

//         res.status(200).json({ message: "Car created successfully", data: savedCar });

//     } catch (error) {
//         console.error("Error in createCar:", error);
//         res.status(error.status || 500).json({ error: error.message || "Internal server error" });
//     }
// };

// const createCar = async (req, res) => {
//     try {
//         const {
//             brand,
//             model,
//             year,
//             color,
//             registrationNumber,
//             fuelType,
//             transmission,
//             seats,
//             rentalPricePerDay,
//             description,
//             category,
//             location,
//             features, // ✅ include features here
//         } = req.body;

//         const ownerId = req.user.id;

//         console.log("Logged-in Owner ID:", ownerId);
//         console.log("Request Body =", req.body);
//         console.log("Uploaded Files =", req.files);

//         if (
//             !brand || !model || !year || !color || !registrationNumber ||
//             !fuelType || !transmission || !seats || !rentalPricePerDay || !category || !location
//         ) {
//             return res.status(400).json({ message: "All required fields must be filled." });
//         }

//         const imageUrls = [];

//         for (const file of req.files) {
//             const uploadResult = await cloudinaryInstance.uploader.upload(file.path);
//             imageUrls.push(uploadResult.secure_url);
//         }

//         const newCar = new CarDb({
//             brand,
//             model,
//             year,
//             color,
//             registrationNumber,
//             fuelType,
//             transmission,
//             seats,
//             rentalPricePerDay,
//             description,
//             category,
//             location,
//             images: imageUrls,
//             owner: ownerId,
//             features
//         });

//         const savedCar = await newCar.save();

//         await OwnerDb.findByIdAndUpdate(
//             ownerId,
//             { $push: { cars: savedCar._id } },
//             { new: true }
//         );

//         res.status(200).json({ message: "Car created successfully", data: savedCar });

//     } catch (error) {
//         console.error("Error in createCar:", error);
//         res.status(error.status || 500).json({ error: error.message || "Internal server error" });
//     }
// };


const createCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      registrationNumber,
      fuelType,
      transmission,
      seats,
      rentalPricePerDay,
      description,
      category,
      location,
      features, // ✅ include features here
    } = req.body;

    const ownerId = req.user.id;

    console.log("Logged-in Owner ID:", ownerId);
    console.log("Request Body =", req.body);
    console.log("Uploaded File =", req.file);

    if (
      !brand ||
      !model ||
      !year ||
      !color ||
      !registrationNumber ||
      !fuelType ||
      !transmission ||
      !seats ||
      !rentalPricePerDay ||
      !category ||
      !location
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // ✅ handle single file upload
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
      imageUrl = uploadResult.secure_url;
    }

    const newCar = new CarDb({
      brand,
      model,
      year,
      color,
      registrationNumber,
      fuelType,
      transmission,
      seats,
      rentalPricePerDay,
      description,
      category,
      location,
      images: imageUrl ? [imageUrl] : [], // ✅ store in array for consistency
      owner: ownerId,
      features,
    });

    const savedCar = await newCar.save();

    await OwnerDb.findByIdAndUpdate(
      ownerId,
      { $push: { cars: savedCar._id } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Car created successfully", data: savedCar });
  } catch (error) {
    console.error("Error in createCar:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};




const updateCar = async (req, res) => {

  try {
    const carId = req.params.id;
    const { brand, model, year, color, registrationNumber, fuelType, transmission, seats, rentalPricePerDay, available, description, category, location, } = req.body;

    const updateFields = { brand, model, year, color, registrationNumber, fuelType, transmission, seats, rentalPricePerDay, available, description, category, location, };

    // Remove undefined or empty fields  and filtering invalid fields 
    Object.keys(updateFields).forEach((key) => {
      if (!updateFields[key]) delete updateFields[key];
    });

    // Check if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields for update" });
    }

    const updatedProductData = await CarDb.findByIdAndUpdate(carId, updateFields, { new: true }).select("-password");

    if (!updatedProductData) {
      return res.status(400).json({ message: "Sorry, Car not updated" });
    }
    res.status(200).json({ message: "Car updated successfully", data: updatedProductData });

  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};

const getAllCar = async (req, res) => {
  try {
    const allCar = await CarDb.find().select("brand model rentalPricePerDay images category year seats fuelType transmission location isAvailable ")
    if (!allCar || allCar.length === 0) {
      return res.status(404).json({ message: "Cars not found" });
    }

    res.status(200).json({ message: "Cars fetched successfully", data: allCar })
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })
  }
}

const getCar = async (req, res) => {
  try {
    const carId = req.params.id
    console.log(carId, '--Car ID')
    const singleCar = await CarDb.findById(carId).populate("features");

    if (!singleCar) {
      return res.status(400).json({ message: "Sorry, Product not found" })
    }

    res.status(200).json({ message: "Fetched a Car", data: singleCar })
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })
  }
}

const getOwnerCars = async (req, res) => {

  try {
    const ownerId = req.user.id;
    console.log(ownerId, '---Owner ID')
    const cars = await OwnerDb.findById(ownerId).populate("cars");

    if (!cars || cars.length === 0) {
      return res.status(404).json({ message: "Cars not found" });
    }
    res.status(200).json({ message: "Cars fetched successfully", data: cars });
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })
  }
};

const deleteOwnerCar = async (req, res) => {
  try {
    const carId = req.params.id

    const deleteCar = await CarDb.findByIdAndDelete(carId, req.body)

    if (!deleteCar) {
      return res.status(400).json({ message: "Sorry, Car not found" })
    }

    res.status(200).json({ message: "Car deleted successfully" })
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })
  }
}

const searchCars = async (req, res) => {
  const {
    query,
    year,
    fuelType,
    category,
    transmission,
    seats,
    pickupDate,
    returnDate,
  } = req.query;

  const searchConditions = [];

  // Text search
  if (query && query.trim() !== "") {
    const regex = new RegExp(query.trim(), "i");
    searchConditions.push({
      $or: [
        { brand: regex },
        { model: regex },
        { color: regex },
        { registrationNumber: regex },
        { fuelType: regex },
        { transmission: regex },
        { category: regex },
      ],
    });
  }

  // Numeric filters
  const parsedYear = Number(year);
  if (year && !isNaN(parsedYear)) {
    searchConditions.push({ year: parsedYear });
  }

  const parsedSeats = Number(seats);
  if (seats && !isNaN(parsedSeats)) {
    searchConditions.push({ seats: parsedSeats });
  }

  // Select filters
  if (fuelType && fuelType !== "Any") {
    searchConditions.push({ fuelType });
  }

  if (category && category !== "Any") {
    searchConditions.push({ category });
  }

  if (transmission && transmission !== "Any") {
    searchConditions.push({ transmission });
  }

  // Always check availability
  searchConditions.push({ available: true });

  // Reject if only availability is checked (no real filter)
  if (searchConditions.length <= 1) {
    return res.status(400).json({ message: "Please provide at least one filter to search." });
  }

  try {
    // 🔒 Date-range booking check
    if (pickupDate && returnDate) {
      const bookedCars = await BookingDb.find({
        $or: [
          {
            pickupDate: { $lte: new Date(returnDate) },
            returnDate: { $gte: new Date(pickupDate) },
          },
        ],
      }).distinct("carId");

      // Exclude booked cars
      searchConditions.push({ _id: { $nin: bookedCars } });
    }

    // 🔍 Search cars matching filters and not booked
    const cars = await CarDb.find({ $and: searchConditions });

    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = { createCar, getAllCar, getCar, getOwnerCars, deleteOwnerCar, updateCar, searchCars }