const express = require("express")
const router = express.Router()
const { sendOTP, verifyOTP } = require("./../../controllers/otpController")

//! Verify otp
router.post("/verify", async (req, res) => {
  try {
    let { email, otp } = req.body

    const validOTP = await verifyOTP({ email, otp })

    // TODO: - Respond with `{ "success": true }` if the OTP is correct; otherwise, respond with `{ "success": false }`.

    res.status(200).json({ sucssess: true, valid: validOTP })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

//! Request new verification otp
router.post("/", async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body

    const createdOTP = await sendOTP({
      email,
      subject,
      message,
      duration,
    })
    res.status(200).json(createdOTP)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
