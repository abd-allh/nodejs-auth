const User = require("../models/userModel")
const { hashData, verifyHashedData } = require("../util/hashData")
const createToken = require("../util/createToken")
const LoginAttempt = require("../models/loginAttemptModel")

const authenticateUser = async (data) => {
  try {
    const { email, password } = data

    const fetchedUser = await User.findOne({ where: { email } })

    if (!fetchedUser) {
      throw Error(
        "User with that email does not exist, Register first then verify!"
      )
    }
    if (!fetchedUser.verified_boolean) {
      throw Error("Email hasn't been verified yet. Check your inbox.")
    }

    const hashedPassword = fetchedUser.password

    const passwordMatch = await verifyHashedData(password, hashedPassword)

    if (!passwordMatch) {
      // Increment the login attempts for the user
      await LoginAttempt.incrementAttempts(email)

      throw Error("Invalid password entered!")
    }

    // Reset the login attempts for the user
    await LoginAttempt.resetAttempts(email)

    // Create user token
    const tokenData = { userId: fetchedUser._id, email }
    const token = await createToken(tokenData)

    // Assign user token
    fetchedUser.token = token
    await fetchedUser.save()

    return fetchedUser
  } catch (error) {
    throw error
  }
}

const createNewUser = async (data) => {
  try {
    const { firstname, email, password, lastname, age, mobile, howfoundus_id } =
      data

    //? Checking if the user already exists
    const isUserExists = await User.findOne({ where: { email } })

    if (isUserExists) {
      throw Error("User already exists!")
    }

    //* hash password
    const hashedPassword = await hashData(password)

    //* Create the user
    const user = await User.create({
      firstname,
      email,
      password: hashedPassword,
      lastname,
      age,
      mobile,
      howfoundus_id,
    })
    const savedUser = await user.save()
    return savedUser
  } catch (error) {
    throw error
  }
}

module.exports = { createNewUser, authenticateUser }
