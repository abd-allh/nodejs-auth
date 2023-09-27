const OTP = require("./model")
const generateOTP = require("./../../util/generateOTP")
const sendEmail = require("./../../util/sendEmail")
const { hashData, verifyHashedData } = require("./../../util/hashData")
const { AUTH_EMAIL } = process.env

const verifyOTP = async ({ email, otp }) => {
  try {
    if (!(email && otp)) {
      throw Error("Provide values for email, otp")
    }

    //* ensure otp record exists
    const matchedOTPRecord = await OTP.findOne({ where: { email } })

    if (!matchedOTPRecord) {
      throw Error("No otp records found.")
    }

    const { expiresAt } = matchedOTPRecord

    // TODO: - If the OTP is incorrect or has expired (after 4 minutes ), respond with `{ "success": false,
    //* checking for expired code
    if (expiresAt < Date.now()) {
      await OTP.destroy({ where: { email } })
      throw Error("Code has expired. Request for a new one.")
    }

    //* not expired yet, verify value
    const hashedOTP = matchedOTPRecord.otp
    const validOTP = await verifyHashedData(otp, hashedOTP)

    return validOTP
  } catch (error) {
    throw error
  }
}

// TODO: - no need to implement real API for OTP you can just call an empty function called sendOTP()
//! Too late!
const sendOTP = async ({ email, subject, message, duration = 4 }) => {
  try {
    if (!(email && subject && message)) {
      throw Error("Provide values for email, subject, message")
    }

    //* clear any old record
    await OTP.destroy({ where: { email } })

    //* generate new pin
    const generatedOTP = await generateOTP()
    console.log(
      "\u001b[95m" +
        "\n                                                 " +
        `This is the unhashed OTP: ${generatedOTP}\n \u001b[0m`
    )

    //* send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p><p style="colot:tomato;
      font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p>
      <p>This code <b> expires in ${duration} minute(s)</b>.</p>`,
    }
    await sendEmail(mailOptions)

    //* save otp record
    const hashedOTP = await hashData(generatedOTP)
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt: Date.now() + 60000 * +duration, // 60000 represents the number of milliseconds in a minute!
    })
    const savedOTPRecord = await newOTP.save()
    return savedOTPRecord
  } catch (error) {
    throw error
  }
}

const deleteOTP = async (email) => {
  try {
    await OTP.destroy({ where: { email } })
  } catch (error) {
    throw error
  }
}

module.exports = { sendOTP, verifyOTP, deleteOTP }
