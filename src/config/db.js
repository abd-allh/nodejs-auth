const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
  }
)

sequelize.sync()
// sequelize.sync({ force: true })
// sequelize.sync({ alter: true })

async function myFunc() {
  try {
    await sequelize.authenticate()
    console.log(
      "\u001b[1;32m Connection has been established successfully. \u001b[0m"
    )
  } catch (error) {
    console.error("Unable to connect to the database: ", error)
  }
}
myFunc()

module.exports = sequelize
