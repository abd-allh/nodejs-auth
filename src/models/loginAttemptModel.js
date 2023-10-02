const { DataTypes } = require("sequelize")
const sequelize = require("./../config/db")

var MAX_ATTEMPTS = 3
var BLOCK_DURATION = 60 * 60 * 1000

const LoginAttempt = sequelize.define(
  "LoginAttempt",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    blockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "login_attempts",
    timestamps: false,
  }
)

// Method to increment the login attempts for a specific email
LoginAttempt.incrementAttempts = async (email) => {
  const loginAttempt = await LoginAttempt.findOne({ where: { email } })

  if (loginAttempt) {
    loginAttempt.attempts += 1

    if (loginAttempt.attempts >= MAX_ATTEMPTS) {
      loginAttempt.blockedUntil = new Date(Date.now() + BLOCK_DURATION)
    }

    await loginAttempt.save()
  } else {
    await LoginAttempt.create({ email, attempts: 1 })
  }
}

// Method to reset the login attempts for a specific email
LoginAttempt.resetAttempts = async (email) => {
  await LoginAttempt.destroy({ where: { email } })
}

module.exports = LoginAttempt
