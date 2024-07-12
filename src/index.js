// app.js
const express = require("express")
const serverless = require("serverless-http")

// Create an instance of the Express application
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.post("/notification", (req, res) => {
  if (req.query.token !== "2d2aedde-728c-473c-a1a2-cfaef52057f4")
    res.json({ error: "Invalid token" })
  res.json({ init: "Hello, World!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something went wrong!")
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const handler = serverless(app)
module.exports = {
  handler,
}
