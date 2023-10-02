const User = require("./../models/userModel")
const { sendOTP, verifyOTP, deleteOTP } = require("./otpController")
const { hashData } = require("../util/hashData")

const resetUserPassword = async ({ email, otp, newPassword }) => {
  try {
    const validOTP = await verifyOTP({ email, otp })

    if (!validOTP) throw Error("Invalid code passed. Check your inbox.")

    //* Update user record with new password.
    if (newPassword.lenght < 8) {
      throw Error("Password is too short!")
    }
    const hashedNewPassword = await hashData(newPassword)
    await User.update({ password: hashedNewPassword }, { where: { email } })
    await deleteOTP(email)

    return
  } catch (error) {
    throw error
  }
}

const sendPasswordResetOTPEmail = async (email) => {
  try {
    //? Checking if the user already exists
    const isUserExists = await User.findOne({ where: { email } })
    if (!isUserExists) {
      throw Error("There's no account for the provided email.")
    }
    if (!isUserExists.verified_boolean) {
      throw Error("Email hasn't been verified yet. Check your inbox.")
    }
    const otpDetails = {
      email,
      subject: "Email Verification",
      message: "Verify your email with the code below,",
      duration: 4,
    }
    const createOTP = await sendOTP(otpDetails)
    return createOTP
  } catch (error) {
    throw error
  }
}

module.exports = { sendPasswordResetOTPEmail, resetUserPassword }
