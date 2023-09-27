const express = require("express")
const router = express.Router()
const { createNewUser, authenticateUser } = require("./controller")
const verifyToken = require("../../Middleware/auth")
const auth = require("./../../Middleware/auth")
const {
  sendVerificationOTPEmail,
} = require("./../email_verification/controller")

// TODO: - Create an API endpoint for user login, where users provide their `user_id` and OTP
//! Login
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body

    email = email.trim()
    password = password.trim()

    if (!(email && password)) {
      throw Error("Empty credentials supplied!")
    }
    // TODO: - If the user is verified (`verified_boolean` is true) and the OTP is correct, respond with JWT token and name.
    const authenticatedUser = await authenticateUser({ email, password })
    // TODO: respond with JWT token and name.
    res.status(200).json({
      authenticated: true,
      id: authenticatedUser.id,
      name: `${authenticatedUser.firstname} ${authenticatedUser.lastname}`,
      message: "The OTP is correct",
      token: authenticatedUser.token,
    })
  } catch (error) {
    // TODO: - If the user is not verified, respond with `{ "success": false, "id": user_id, "message": "OTP Sent" }` and send new OTP
    res.status(418).json({
      success: false,
      authenticated: false,
      email: req.body.email,
      message: error.message,
    })
  }
})

// TODO: - Create an API endpoint that allows users to register by sending a JSON request...
//! Register
router.post("/register", async (req, res) => {
  try {
    let { firstname, email, password, lastname, age, mobile } = req.body

    firstname = firstname.trim()
    email = email.trim()
    password = password.trim()
    // TODO: - Validate all input fields and ensure that they meet the specified criteria.

    if (!(firstname && email && password)) {
      throw Error("Empty input fields!")
    } else if (!/^[a-zA-Z ]*$/.test(firstname)) {
      throw Error("Invalid name entered")
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw Error("Invalid email entered")
    } else if (password.lenght < 8) {
      throw Error("Password is too short!")
    } else {
      //// almost good credentials, create new user
      const user = await createNewUser({
        firstname,
        email,
        password,
        lastname,
        age,
        mobile,
      })
      // TODO: - If successful registration, generate an OTP and send it to the provided mobile number.
      await sendVerificationOTPEmail(email)
      // TODO: - Respond with `{ "success": true, "id": user_id, "message": "OTP Sent" }`.
      res.status(201).json({
        success: true,
        id: user.id,
        verified: user.verified_boolean,
        message: "OTP Sent",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Registration failed: ${error.message}`,
    })
  }
})

//! Protrcted route
router.get("/private", verifyToken, (req, res) => {
  res
    .status(200)
    .send(`You're in the private territory of ${req.currentUser.email}`)
})

module.exports = router
