import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import authRoutes from "./routes/auth.js"
import spotifyRoutes from "./routes/spotify.js"

dotenv.config()

const app = express()

const frontend_uri = process.env.FRONTEND_URI

// middleware
app.use(cors({
  origin: frontend_uri,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(bodyParser.json())

// routes
app.use("/", authRoutes)
app.use("/", spotifyRoutes)

// health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀")
})

// start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
  console.log(`Frontend URL: ${frontend_uri}`)
})

export default app