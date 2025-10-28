const UserDb = require('../model/userModel')
const AdminDb = require('../model/adminModel')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { generateToken } = require('../utils/token')

const signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        if (mobile && !/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
        }

        const userAlreadyExistWithEmail = await UserDb.findOne({ email })

        if (userAlreadyExistWithEmail) {
            return res.status(400).json({ error: "User with this email already exists" })
        }

        const userAlreadyExistWithMobile = await UserDb.findOne({ mobile })

        if (userAlreadyExistWithMobile) {
            return res.status(400).json({ error: "User with this mobile number already exists" })
        }

        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(password, salt)

        const newUser = new UserDb({
            name, email, password: hashedpassword, mobile
        })

        const savedUser = await newUser.save()

        const { password: _, ...userData } = savedUser.toObject();

        res.status(200).json({ message: "User registered successfully", data: userData })

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await UserDb.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!user.isActive) {
            return res.status(404).json({ message: "Sorry, you cannot login because your account has been deactivated! Contact Admin..." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        const token = generateToken(user, "user");
        console.log(token, '--User Token')

        res.cookie("token", token, {
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true
        });

        const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;

        return res.status(200).json({ message: "Login successful", data: userWithoutPassword });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserDb.find().select("-password");
        res.status(200).json({ message: "All users fetched successfully", data: users, });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while fetching users", });
    }
};

const userProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await UserDb.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({ message: "Sorry, user not found" })
        }

        if (!user.isActive) {
            return res.status(404).json({ message: "Sorry, Your account deactivated" })
        }

        res.status(200).json({ message: "User profile fetched", data: user })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" })
    }
}

const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true
        });

        return res.status(200).json({ message: "User logout successfull" });

    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

const checkUser = async (req, res) => {
    try {
        console.log("Decoded User from Token:", req.user);
        const userId = req.user?.id;

        console.log("User Id -----", userId)

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        const user = await UserDb.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Authorized User", user });

    } catch (error) {
        console.error("Error in checkUser:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, mobile, profilePic } = req.body;

        console.log("Req.body ---- ", req.body);

        const user = await UserDb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({
                error: "Your account has been deactivated. You cannot update profile details.",
            });
        }

        if (!name && !email && !mobile && !profilePic) {
            return res.status(400).json({
                error: "At least one field (name, email, mobile, or profilePic) is required to update",
            });
        }

        if (name && name.length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long" });
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (mobile && !/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({ error: "Mobile number must be 10 digits" });
        }

        const updatedUserData = await UserDb.findByIdAndUpdate(
            userId,
            {
                name: name || user.name,
                email: email || user.email,
                mobile: mobile || user.mobile,
                profilePic: profilePic || user.profilePic,
            },
            { new: true }
        );

        res.status(200).json({ message: "User profile details updated", data: updatedUserData });
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

const activateUser = async (req, res) => {
    try {
        const { userId } = req.params
        const adminId = req.user.id

        console.log("User Id :- ", userId)
        console.log("Admin Id :- ", adminId)

        const user = await UserDb.findById(userId)
        if (!user) {
            res.status(404).json({ message: "Sorry, user not found " })
        }

        const admin = await AdminDb.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            res.status(404).json({ message: "Sorry, only admin can access " })
        }

        if (user.isActive) {
            res.status(404).json({ message: "User is already active!" })
        }

        user.isActive = true;

        await user.save()

        res.status(200).json({ message: "User account has been activated successfully", data: user })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" })
    }
}

const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.id;

        console.log("User Id :- ", userId);
        console.log("Admin Id :- ", adminId);

        const user = await UserDb.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Sorry, user not found" });
        }

        const admin = await AdminDb.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Sorry, only admin can access" });
        }

        if (!user.isActive) {
            return res.status(400).json({ message: "User already deactivated!" });
        }

        user.isActive = false;
        await user.save();

        return res.status(200).json({
            message: "User account has been deactivated successfully",
            data: user,
        });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
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

        const user = await UserDb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: "Your account has been deactivated. You cannot change the password." });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

const userForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserDb.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", user);

        const resetToken = crypto.randomBytes(32).toString("hex");

        console.log("Generated reset token:", resetToken);

        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + process.env.TOKEN_EXPIRATION * 60 * 1000;

        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/user/user-reset-password/${resetToken}`;

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
            subject: "Reset your S&J User Password",
            text: `We have received a password reset request for your account. 
                If you did not request this, you can safely ignore this email. 

                lick the link below to reset your password:
                ${resetLink}`,
        });

        res.status(200).json({ message: "Reset email sent!" });
    } catch (error) {
        console.error("Error in userForgotPassword:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const userResetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        if (!newPassword || newPassword.trim().length < 8) {
            return res.status(400).json({
                message: "Invalid password. Password must be at least 8 characters long.",
            });
        }

        const user = await UserDb.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() },
        });

        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Your password has been reset successfully!" });
    } catch (error) {
        console.error("Error in userResetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { signup, login, userProfile, userLogout, checkUser, updateUserProfile, activateUser, deactivateUser, changePassword, userForgotPassword, userResetPassword, getAllUsers }