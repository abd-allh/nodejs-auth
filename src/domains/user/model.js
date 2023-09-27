// TODO: users table: id, firstname, lastname, age,
// TODO:   howfoundus_id, verified_boolean, mobile, password

const { DataTypes } = require("sequelize")
const sequelize = require("./../../config/db")

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  howfoundus_id: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  verified_boolean: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  token: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

module.exports = User
