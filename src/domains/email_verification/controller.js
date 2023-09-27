const User = require("./../user/model")
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller")

const verifyUserEmail = async ({ email, otp }) => {
  try {
    const validOTP = await verifyOTP({ email, otp })
    if (!validOTP) {
      throw Error("Invalid code passed. Check your inbox.")
    }
    // TODO: - If the OTP is correct, set the `verified_boolean` to true in the `users` table.
    await User.update({ verified_boolean: true }, { where: { email } })
    await deleteOTP(email)
    return
  } catch (error) {
    throw error
  }
}

const sendVerificationOTPEmail = async (email) => {
  try {
    //? Checking if the user already exists
    const isUserExists = await User.findOne({ where: { email } })

    if (!isUserExists) {
      throw Error("There is no account for the provided email.")
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

module.exports = { sendVerificationOTPEmail, verifyUserEmail }
