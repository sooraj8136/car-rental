const { signupAdmin, loginAdmin, checkAdmin, adminProfile, adminLogout, updateAdminProfile, changeAdminPassword, deleteOwnerByAdmin } = require("../../controller/adminController")
const { adminAuth } = require("../../middlewares/adminAuth")
const adminRouter = require('express').Router()

adminRouter.post("/admin-signup", signupAdmin)
adminRouter.post("/admin-login", loginAdmin)
adminRouter.get("/check-admin", adminAuth, checkAdmin)
adminRouter.get("/admin-profile", adminAuth, adminProfile)
adminRouter.post("/admin-logout",adminAuth, adminLogout)
adminRouter.put("/update-admin-profile",adminAuth, updateAdminProfile)
adminRouter.post("/admin-change-password",adminAuth, changeAdminPassword)
adminRouter.delete("/delete-owner-by-admin/:ownerId", adminAuth, deleteOwnerByAdmin);
 
module.exports = adminRouter