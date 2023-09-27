const app = require("./app")

const port = process.env.PORT || 5000

const startApp = () => {
  app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`)
  })
}

startApp()
