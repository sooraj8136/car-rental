const { signup, login, userProfile, userLogout, checkUser, updateUserProfile, activateUser, deactivateUser, changePassword, userForgotPassword, userResetPassword, getAllUsers } = require('../../controller/userController')
const { adminAuth } = require('../../middlewares/adminAuth')
const { userAuth } = require('../../middlewares/userAuth')
const userRouter = require('express').Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.get("/get-all-users", adminAuth, getAllUsers)
userRouter.get("/profile", userAuth, userProfile)
userRouter.post("/logout", userAuth, userLogout)
userRouter.get("/check-user", userAuth, checkUser)
userRouter.put("/update-user-profile", userAuth, updateUserProfile)
userRouter.post("/activate-user/:userId", adminAuth, activateUser)
userRouter.post("/deactivate-user/:userId", adminAuth, deactivateUser)
userRouter.post("/change-user-password", userAuth, changePassword)
userRouter.post("/user-forgot-password", userForgotPassword)
userRouter.post("/user-reset-password/:token", userResetPassword)

module.exports = userRouter