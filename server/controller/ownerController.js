const OwnerDb = require('../model/ownerModel')
const AdminDb = require('../model/adminModel')
const CarDb = require('../model/carModel')
const ConfirmationRequest = require('../model/permissionModel');
const BookingDb = require('../model/bookingModel')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { generateToken } = require('../utils/token');

// const signupOwner = async (req, res) => {
//     try {
//         const { name, email, mobile, password, companyName, address } = req.body;

//         if (!name || !email || !mobile || !password || !companyName || !address) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         if (name.length < 2 || name.length > 50) {
//             return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({ error: "Invalid email format" });
//         }

//         const mobileValidation = /^[0-9]{10,15}$/;
//         if (!mobileValidation.test(mobile)) {
//             return res.status(400).json({ error: "Mobile number must be between 10 and 15 digits" });
//         }

//         if (password.length < 8) {
//             return res.status(400).json({ error: "Password must be at least 8 characters long" });
//         }

//         if (address.length < 2 || address.length > 50) {
//             return res.status(400).json({ error: "Address must be between 2 and 50 characters" });
//         }

//         const ownerEmailExist = await OwnerDb.findOne({ email }).select("_id");
//         if (ownerEmailExist) {
//             return res.status(400).json({ error: "This email is already registered" });
//         }

//         const ownerMobileExist = await OwnerDb.findOne({ mobile }).select("_id");
//         if (ownerMobileExist) {
//             return res.status(400).json({ error: "This mobile number is already registered" });
//         }

//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newOwner = new OwnerDb({
//             name,
//             email,
//             mobile,
//             password: hashedPassword,
//             companyName: companyName || null,
//             address,
//         });

//         const savedOwner = await newOwner.save();

//         res.status(200).json({ message: "Owner registered successfully", data: savedOwner });
//     } catch (error) {
//         console.error(error);
//         res.status(error.status || 500).json({ error: error.message || "Internal server error" });
//     }
// };

const signupOwner = async (req, res) => {
  try {
    const { name, email, mobile, password, companyName, address } = req.body;

    if (!name || !email || !mobile || !password || !companyName || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ Updated mobile number validation to exactly 10 digits
    const mobileValidation = /^\d{10}$/;
    if (!mobileValidation.test(mobile)) {
      return res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    if (address.length < 2 || address.length > 50) {
      return res.status(400).json({ error: "Address must be between 2 and 50 characters" });
    }

    const ownerEmailExist = await OwnerDb.findOne({ email }).select("_id");
    if (ownerEmailExist) {
      return res.status(400).json({ error: "This email is already registered" });
    }

    const ownerMobileExist = await OwnerDb.findOne({ mobile }).select("_id");
    if (ownerMobileExist) {
      return res.status(400).json({ error: "This mobile number is already registered" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new OwnerDb({
      name,
      email,
      mobile,
      password: hashedPassword,
      companyName: companyName || null,
      address,
    });

    const savedOwner = await newOwner.save();

    res.status(200).json({ message: "Owner registered successfully", data: savedOwner });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "Internal server error" });
  }
};





const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const owner = await OwnerDb.findOne({ email });

        if (!owner) {
            return res.status(400).json({ error: "owner not found" });
        }

        const passwordMatch = await bcrypt.compare(password, owner.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        if (!owner.isActive) {
            return res.status(400).json({ error: "owner profile is deactivated" });
        }

        const token = generateToken(owner, "owner");
        console.log(token)

        res.cookie("owner_token", token, {
            sameSite: "None",
            secure: true,
            httpOnly: true
        });

        res.status(200).json({ message: "owner login successfully", data: owner });
        console.log(owner)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const getAllOwners = async (req, res) => {
    try {
        const owners = await OwnerDb.find().select("-password");
        res.status(200).json({
            message: "All owners fetched successfully", data: owners,
        });
    } catch (error) {
        console.error("Error fetching owners:", error);
        res.status(500).json({ message: "Server error while fetching owners", });
    }
};

const ownerProfile = async (req, res) => {
    try {
        const ownerId = req.user?.id

        if (!ownerId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token or session expired" });
        }

        const owner = await OwnerDb.findById(ownerId).select("-password")

        if (!owner) {
            return res.status(404).json({ message: "Sorry, Owner not found" })
        }

        if (!owner.isActive) {
            return res.status(404).json({ message: "Sorry, Your account deactivated" })
        }

        res.status(200).json({ message: "Owner profile fetched", data: owner })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" })
    }
}

const checkOwner = async (req, res) => {
    try {
        const ownerId = req.user?.id;

        if (!ownerId) {
            return res.status(401).json({ message: "Unauthorized. Owner ID not found." });
        }

        const owner = await OwnerDb.findById(ownerId);

        if (!owner) {
            return res.status(404).json({ message: "Owner not found." });
        }

        if (!owner.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated. Please contact support." });
        }

        res.status(200).json({ message: "Authorized Owner", owner: { name: owner.name, email: owner.email } });
    } catch (error) {
        console.error("Error during Owner check:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// const updateOwnerProfile = async (req, res) => {
//     try {
//         const ownerId = req.user?.id
//         const { name, email, mobile, companyName, address } = req.body

//         if (!name && !email && !mobile && !companyName && !address) {
//             res.status(400).json({ message: "At least one field is required to update" })
//         }
//         if (email) {
//             const existingOwnerEmail = await OwnerDb.findOne({ email });
//             if (existingOwnerEmail && existingOwnerEmail._id.toString() !== ownerId) {
//                 return res.status(400).json({ error: "This Email already registered with another Owner" });
//             }
//         }
//         if (mobile) {
//             const existingOwnerMobile = await OwnerDb.findOne({ mobile });
//             if (existingOwnerMobile && existingOwnerMobile._id.toString() !== ownerId) {
//                 return res.status(400).json({ error: "This Mobile number already registered with another owner" });
//             }
//         }
//         const owner = await OwnerDb.findById(ownerId)

//         if (!owner) {
//             return res.status(404).json({ error: "Sorry, owner not found" });
//         }
//         if (name)
//             owner.name = name
//         if (email)
//             owner.email = email
//         if (mobile)
//             owner.mobile = mobile
//         if (companyName)
//             owner.companyName = companyName
//         if (address)
//             owner.address = address

//         await owner.save()

//         const updatedOwnerProfile = await OwnerDb.findById(ownerId).select("-password");

//         if (!updatedOwnerProfile) {
//             res.status(400).jsaon({ message: "Sorry, Owner profile is not updated" })
//         }

//         console.log(updatedOwnerProfile)
//         res.status(200).json({ message: "Owner profile updated successfully", data: updatedOwnerProfile })

//     } catch (error) {
//         console.log(error);
//         res.status(error.status || 500).json({ error: error.message || "Internal server Error" })
//     }
// }


const updateOwnerProfile = async (req, res) => {
    try {
        const ownerId = req.user?.id;
        const { name, email, mobile, companyName, address } = req.body;

        if (!name && !email && !mobile && !companyName && !address) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        // ✅ Validate email format
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // ✅ Validate mobile format
        if (mobile && !/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({ error: "Mobile number must be 10 digits" });
        }

        // ✅ Check if email is already in use
        if (email) {
            const existingOwnerEmail = await OwnerDb.findOne({ email });
            if (existingOwnerEmail && existingOwnerEmail._id.toString() !== ownerId) {
                return res.status(400).json({ error: "This Email is already registered with another Owner" });
            }
        }

        // ✅ Check if mobile is already in use
        if (mobile) {
            const existingOwnerMobile = await OwnerDb.findOne({ mobile });
            if (existingOwnerMobile && existingOwnerMobile._id.toString() !== ownerId) {
                return res.status(400).json({ error: "This Mobile number is already registered with another Owner" });
            }
        }

        const owner = await OwnerDb.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Sorry, owner not found" });
        }

        // ✅ Update fields if provided
        if (name) owner.name = name;
        if (email) owner.email = email;
        if (mobile) owner.mobile = mobile;
        if (companyName) owner.companyName = companyName;
        if (address) owner.address = address;

        await owner.save();

        const updatedOwnerProfile = await OwnerDb.findById(ownerId).select("-password");
        if (!updatedOwnerProfile) {
            return res.status(400).json({ message: "Sorry, Owner profile was not updated" });
        }

        console.log(updatedOwnerProfile);
        res.status(200).json({ message: "Owner profile updated successfully", data: updatedOwnerProfile });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};





const activateOwner = async (req, res) => {
    try {
        const { ownerId } = req.params
        const adminId = req.user.id

        console.log("Owner Id :- ", ownerId)
        console.log("Admin Id :- ", adminId)

        const owner = await OwnerDb.findById(ownerId)
        if (!owner) {
            res.status(404).json({ message: "Sorry, Owner not found " })
        }

        const admin = await AdminDb.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            res.status(404).json({ message: "Sorry, only admin can access " })
        }

        if (owner.isActive) {
            res.status(404).json({ message: "Owner is already active!" })
        }

        owner.isActive = true;

        await owner.save()

        res.status(200).json({ message: "Owner account has been activated successfully", data: owner })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" })
    }
}

const deactivateOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const adminId = req.user.id;

        console.log("Owner Id :- ", ownerId);
        console.log("Admin Id :- ", adminId);

        const owner = await OwnerDb.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: "Sorry, Owner not found" });
        }

        const admin = await AdminDb.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Sorry, only admin can access" });
        }

        if (!owner.isActive) {
            return res.status(400).json({ message: "Owner already deactivated!" });
        }

        owner.isActive = false;
        await owner.save();

        return res.status(200).json({
            message: "Owner account has been deactivated successfully",
            data: owner,
        });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
};

const ownerLogout = async (req, res) => {
    try {
        res.clearCookie("owner_token", {
            sameSite: "None",
            secure: true,
            httpOnly: true
        });
        res.status(200).json({ message: "Owner logout successfull." });
    } catch (error) {
        console.error("Error during Owner logout:", error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error", });
    }
};

const changePasswordowner = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ error: "All fields are required: currentPassword, newPassword, confirmNewPassword" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "New password must be at least 8 characters long" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: "New password and confirm password do not match" });
        }

        const owner = await OwnerDb.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        if (!owner.isActive) {
            return res.status(403).json({ error: "Your account has been deactivated. You cannot change the password." });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, owner.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        owner.password = hashedPassword;
        await owner.save();

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

const ownerForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const owner = await OwnerDb.findOne({ email });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        console.log("Owner found:", owner);

        const resetToken = crypto.randomBytes(32).toString("hex");

        console.log("Generated reset token:", resetToken);

        owner.resetToken = resetToken;
        owner.resetTokenExpires = Date.now() + process.env.TOKEN_EXPIRATION * 60 * 1000;

        await owner.save();

        const resetLink = `${process.env.CLIENT_URL}/owner/owner-reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"S&J" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your S&J Owner Password",
            text: `We have received a password reset request for your account.
                If you did not request this, you can safely ignore this email. 

                lick the link below to reset your password:
                ${resetLink}`,
        });

        res.status(200).json({ message: "Reset email sent!" });
    } catch (error) {
        console.error("Error in owner ForgotPassword:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const ownerResetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        if (!newPassword || newPassword.trim().length < 8) {
            return res.status(400).json({
                message: "Invalid password. Password must be at least 8 characters long.",
            });
        }

        const owner = await OwnerDb.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() },
        });

        console.log("Owner found:", owner);

        if (!owner) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        owner.password = hashedPassword;
        owner.resetToken = undefined;
        owner.resetTokenExpires = undefined;

        await owner.save();

        res.status(200).json({ message: "Your password has been reset successfully!" });
    } catch (error) {
        console.error("Error in Owner ResetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteOwnAccount = async (req, res) => {
    try {
        const ownerId = req.user.id; // From token
        console.log(ownerId, '--Owner Id')
        const deletedOwner = await OwnerDb.findByIdAndDelete(ownerId);

        if (!deletedOwner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.status(200).json({ message: "Your account has been deleted" });
    } catch (error) {
        console.error("Owner delete error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// const confirmBookingByOwner = async (req, res) => {
//     try {
//         const { requestId } = req.params;
//         const { isApproved } = req.body;

//         if (typeof isApproved !== 'boolean') {
//             return res.status(400).json({ message: 'isApproved must be true or false' });
//         }

//         const request = await ConfirmationRequest.findById(requestId).populate('bookingId');
//         if (!request) return res.status(404).json({ message: "Request not found" });

//         const booking = request.bookingId;
//         if (!booking) return res.status(404).json({ message: "Booking not found" });

//         request.isApproved = isApproved;
//         await request.save();

//         if (isApproved) {
//             booking.ownerConfirmation = "confirmed";
//         } else {
//             booking.ownerConfirmation = "declined";

//             if (booking.status === "paid" && booking.paymentId) {
//                 try {
//                     const refund = await stripe.refunds.create({
//                         payment_intent: booking.paymentId
//                     });
//                     console.log("💸 Refund issued:", refund.id);
//                 } catch (refundError) {
//                     console.error("Refund failed:", refundError);
//                 }
//             }

//             booking.status = "declined";
//         }

//         await booking.save();

//         res.status(200).json({
//             message: `Booking ${isApproved ? "confirmed" : "declined"} successfully`,
//             booking,
//         });

//     } catch (error) {
//         console.error("Error confirming booking:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


// const getPendingBookingsForOwner = async (req, res) => {
//     try {
//         const ownerId = req.user.id; // From ownerAuth middleware
//         console.log(ownerId, 'Owner Id');

//         const pendingRequests = await ConfirmationRequest.find({
//             ownerId: ownerId,           // ✅ Filter properly
//             isApproved: null            // ✅ Only requests not yet approved
//         }).populate('bookingId');

//         const bookings = pendingRequests.map(request => request.bookingId);

//         res.status(200).json({
//             message: "Pending booking requests",
//             count: bookings.length,
//             bookings
//         });

//     } catch (error) {
//         console.error("Error fetching pending requests:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// // 1. Define createConfirmationRequest first
// const createConfirmationRequest = async (booking, ownerId) => {
//   try {
//     const exists = await ConfirmationRequest.findOne({ bookingId: booking._id });
//     if (exists) return;

//     const newRequest = new ConfirmationRequest({
//       bookingId: booking._id,
//       ownerId: ownerId,
//     });

//     await newRequest.save();
//     console.log("📩 Confirmation request sent to owner:", ownerId);
//   } catch (error) {
//     console.error("Error creating confirmation request:", error);
//   }
// };

// 2. Then use it inside sendConfirmationRequest
// const sendConfirmationRequest = async (req, res) => {
//   const { bookingId } = req.body;

//   try {
//     const booking = await BookingDb.findById(bookingId).populate("carId");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (booking.status !== "paid") {
//       return res.status(400).json({ message: "Booking is not paid yet" });
//     }

//     if (booking.ownerConfirmation !== "pending") {
//       return res.status(400).json({ message: "Booking already confirmed or declined" });
//     }

//     const ownerId = booking.carId.ownerId;

//     console.log(`📤 Sending confirmation request for booking ID: ${bookingId}`);
//     await createConfirmationRequest(booking, ownerId);

//     res.status(200).json({ message: "Confirmation request sent to owner" });

//   } catch (err) {
//     console.error("Failed to send confirmation request:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const createConfirmationRequest = async (booking, ownerId) => {
    try {
        const exists = await ConfirmationRequest.findOne({ bookingId: booking._id });
        if (exists) return;

        const newRequest = new ConfirmationRequest({
            bookingId: booking._id,
            ownerId,
        });

        await newRequest.save();
        console.log("📩 Confirmation request sent to owner:", ownerId);
    } catch (error) {
        console.error("❌ Error creating confirmation request:", error);
    }
};

// 2️⃣ Send confirmation request (called after payment)
const sendConfirmationRequest = async (req, res) => {
    try {
        const { bookingId } = req.body;
        console.log("📥 Request Body:", req.body);

        if (!mongoose.isValidObjectId(bookingId)) {
            return res.status(400).json({ message: "Invalid Booking ID provided." });
        }

        const booking = await BookingDb.findById(bookingId).populate("carId");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.status !== "paid") {
            return res.status(400).json({ message: "Booking is not paid yet." });
        }

        if (booking.ownerConfirmation !== "pending") {
            return res.status(400).json({ message: "Booking already confirmed or declined." });
        }

        const existingRequest = await ConfirmationRequest.findOne({ bookingId });
        if (existingRequest) {
            return res.status(200).json({ message: "Confirmation request already sent." });
        }

        const ownerId = booking.carId.ownerId;

        const newRequest = new ConfirmationRequest({
            bookingId,
            ownerId,
        });

        await newRequest.save();

        res.status(200).json({ message: "Confirmation request sent to owner." });

    } catch (error) {
        console.error("❌ Error sending confirmation request:", error);
        res.status(500).json({ message: "Failed to send confirmation request." });
    }
};

// 3️⃣ Confirm or decline booking by owner
const confirmBookingByOwner = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ message: "'isApproved' must be true or false." });
    }

    const request = await ConfirmationRequest.findById(requestId).populate("bookingId");
    if (!request) return res.status(404).json({ message: "Request not found." });

    if (request.isApproved !== null) {
      return res.status(400).json({ message: "This request has already been handled." });
    }

    const booking = request.bookingId;
    if (!booking) return res.status(404).json({ message: "Booking not found." });

    request.isApproved = isApproved;
    await request.save();

    if (isApproved) {
      booking.ownerConfirmation = "confirmed";
      booking.status = "confirmed";
    } else {
      booking.ownerConfirmation = "declined";
      booking.status = "declined";

      if (booking.paymentId && booking.status === "paid") {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: booking.paymentId,
          });
          console.log("💸 Refund issued:", refund.id);
        } catch (refundError) {
          console.error("❌ Refund failed:", refundError);
        }
      }
    }

    await booking.save();

    res.status(200).json({
      message: `Booking ${isApproved ? "confirmed" : "declined"} successfully.`,
      booking,
    });
  } catch (error) {
    console.error("❌ Error confirming booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4️⃣ Get all pending requests for an owner
// const getPendingBookingsForOwner = async (req, res) => {
//     try {
//         const ownerId = req.user.id; // from ownerAuth middleware
//         console.log("🔍 Owner ID:", ownerId);

//         const pendingRequests = await ConfirmationRequest.find({
//             ownerId,
//             isApproved: null,
//         }).populate({
//             path: "bookingId",
//             populate: {
//                 path: "carId",
//                 select: "model images", // add other fields if needed
//             },
//         });

//         const bookings = pendingRequests
//             .map((req) => req.bookingId)
//             .filter(Boolean); // filter out nulls

//         res.status(200).json({
//             message: "Pending booking requests",
//             count: bookings.length,
//             bookings,
//         });

//     } catch (error) {
//         console.error("❌ Error fetching pending bookings:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


const getPendingBookingsForOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const pendingRequests = await ConfirmationRequest.find({
      ownerId,
      isApproved: null,
    }).populate({
      path: "bookingId",
      populate: [
        {
          path: "carId",
          select: "model images",
        },
        {
          path: "userId",
          select: "name email", // optional
        },
      ],
    });

    res.status(200).json({
      message: "Pending booking requests",
      count: pendingRequests.length,
      bookings: pendingRequests, // send full confirmation requests
    });
  } catch (error) {
    console.error("❌ Error fetching pending bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { signupOwner, loginOwner, getAllOwners, ownerProfile, checkOwner, updateOwnerProfile, activateOwner, ownerLogout, deactivateOwner, changePasswordowner, ownerForgotPassword, ownerResetPassword, deleteOwnAccount, confirmBookingByOwner, getPendingBookingsForOwner, createConfirmationRequest, sendConfirmationRequest }