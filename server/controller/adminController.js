const AdminDb = require('../model/adminModel')
const OwnerDb = require('../model/ownerModel')
const { generateToken } = require('../utils/token')
const bcrypt = require('bcrypt')

const signupAdmin = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body

        if (!name || !email || !mobile || !password) {
            res.status(400).json({ message: "All fields are required" })
        }

        const adminEmailExist = await AdminDb.findOne({ email })

        if (adminEmailExist) {
            return res.status(400).json({ error: "This Email already registered with another admin" });
        }

        const adminMobileExist = await AdminDb.findOne({ mobile })

        if (adminMobileExist) {
            return res.status(400).json({ error: "This Mobile number already registered with another admin" });
        }

        const salt = await bcrypt.genSalt()
        const adminHashedPassword = await bcrypt.hash(password, salt)
        const newAdmin = new AdminDb({
            name, email, mobile, password: adminHashedPassword
        })

        const savedAdmin = await newAdmin.save()

        const { password: _, ...userData } = savedAdmin.toObject();

        res.status(200).json({ message: "Admin Account created successfully", data: userData })

        console.log(userData)
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const admin = await AdminDb.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: "Admin not found" });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        if (!admin.isActive) {
            return res.status(400).json({ error: "Admin profile is deactivated" });
        }

        const token = generateToken(admin, "admin");
        console.log(token)

        res.cookie("admin_token", token, {
            sameSite: "None",
            secure: true,
            httpOnly: true
        });

        res.status(200).json({ message: "Login successfully", data: admin });
        console.log(admin)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const checkAdmin = async (req, res) => {
    try {
        const adminId = req.user?.id;

        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized. Admin ID not found." });
        }

        const admin = await AdminDb.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json({ message: "Authorized admin", admin: { name: admin.name, email: admin.email } });
    } catch (error) {
        console.error("Error during admin check:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const adminProfile = async (req, res) => {
    try {
        const adminId = req.user?.id;

        console.log("Admin ID ----", adminId);

        if (!adminId) {
            return res.status(401).json({ message: "Unauthorized. Admin ID not found." });
        }

        const adminData = await AdminDb.findById(adminId).select("-password");

        if (!adminData) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json({
            message: "Admin profile fetched successfully",
            data: adminData,
        });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({
            error: "Internal server error", details: error.message
        });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id
        const { name, email, mobile } = req.body

        if (!name && !email && !mobile) {
            res.status(400).json({ message: "All fields are required" })
        }
        if (email) {
            const existingAdminEmail = await AdminDb.findOne({ email });
            if (existingAdminEmail && existingAdminEmail._id.toString() !== adminId) {
                return res.status(400).json({ error: "This Email already registered with another Admin" });
            }
        }
        if (mobile) {
            const existingAdminMobile = await AdminDb.findOne({ mobile });
            if (existingAdminMobile && existingAdminMobile._id.toString() !== adminId) {
                return res.status(400).json({ error: "This Mobile number already registered with another admin" });
            }
        }
        const admin = await AdminDb.findById(adminId)

        if (!admin) {
            return res.status(404).json({ error: "Sorry, Admin not found" });
        }
        if (name)
            admin.name = name
        if (email)
            admin.email = email
        if (mobile)
            admin.mobile = mobile

        await admin.save()

        const updatedAdminProfile = await AdminDb.findById(adminId).select("-password");

        if (!updatedAdminProfile) {
            res.status(400).jsaon({ message: "Sorry, admin profile is not updated" })
        }

        console.log(updatedAdminProfile)
        res.status(200).json({ message: "Admin profile updated successfully", data: updatedAdminProfile })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" })
    }
}

const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.user?.id; 
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

        const admin = await AdminDb.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Admin password changed successfully" });

    } catch (error) {
        console.error("Error changing admin password:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const adminLogout = async (req, res) => {
    try {
        res.clearCookie("admin_token", {
            sameSite: "None",
            secure: true,
            httpOnly: true
        });
        res.status(200).json({ message: "Admin logout successfull." });
    } catch (error) {
        console.error("Error during admin logout:", error);

        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error",
        });
    }
};

const deleteOwnerByAdmin = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const owner = await OwnerDb.findByIdAndDelete(ownerId);

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        res.status(200).json({ message: "Owner account deleted by admin" });
    } catch (error) {
        console.error("Admin delete error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { signupAdmin, loginAdmin, checkAdmin, adminProfile, adminLogout, updateAdminProfile, changeAdminPassword, deleteOwnerByAdmin }