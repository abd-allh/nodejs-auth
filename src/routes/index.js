const express = require("express")
const router = express.Router()

// Since we have an index file in the domain we can
// just specify the domain name
const userRoutes = require("./../domains/user")
const OTPRoutes = require("./../domains/otp")
const EmailVerificationRoutes = require("./../domains/email_verification")
const ForgotPasswordRoutes = require("./../domains/forgot_password")

//* Telling the router to assign paths to all routes
router.use("/user", userRoutes)
router.use("/otp", OTPRoutes)
router.use("/email_verification", EmailVerificationRoutes)
router.use("/forgot_password", ForgotPasswordRoutes)

module.exports = router
