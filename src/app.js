const express = require("express")
const cors = require("cors")
require("dotenv").config()
const routes = require("./routes")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// specify the initial path for the endpoints
// and tell the app to apply the routes
app.use("/api/v1", routes)
// we can use the path here to apply some versioning to our backend

module.exports = app
