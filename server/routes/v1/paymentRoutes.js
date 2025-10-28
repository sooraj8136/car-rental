const { CreateCheckoutSession, sessionStatus } = require("../../controller/paymentController");
const { userAuth } = require("../../middlewares/userAuth");
const paymentRouter = require("express").Router();

paymentRouter.post("/create-checkout-session", userAuth,CreateCheckoutSession )
paymentRouter.get("/session-status",sessionStatus) 


module.exports = paymentRouter;