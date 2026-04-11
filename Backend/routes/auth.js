import express from "express"
import axios from "axios"
import querystring from "querystring"
import { Buffer } from "buffer"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"

dotenv.config()

const router = express.Router()
router.use(cookieParser())

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI
const frontend_uri = process.env.FRONTEND_URI

// 🔐 LOGIN
router.get("/login", (req, res) => {
  const state = uuidv4()

  res.cookie("spotify_auth_state", state, {
    httpOnly: true,
    sameSite: "Lax",
  })

  const scope = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-top-read",
  ].join(" ")

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri,
        state,
      })
  )
})

// 🔁 CALLBACK
router.get("/callback", async (req, res) => {
  const code = req.query.code
  const state = req.query.state
  const storedState = req.cookies.spotify_auth_state

  if (!state || state !== storedState) {
    return res.redirect(`${frontend_uri}/#error=state_mismatch`)
  }

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    )

    const access_token = tokenResponse.data.access_token
    const expires_in = tokenResponse.data.expires_in

    // safer redirect (no fragile hash handling)
    res.redirect(
      `${frontend_uri}/login?access_token=${access_token}&expires_in=${expires_in}`
    )
  } catch (error) {
    console.error("Callback Error:", error.response?.data || error.message)
    res.redirect(`${frontend_uri}/#error=invalid_token`)
  }
})

// 🔄 REFRESH TOKEN
router.post("/refresh_token", async (req, res) => {
  const refresh_token = req.body.refresh_token

  if (!refresh_token) {
    return res.status(400).json({ error: "Refresh token required" })
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    )

    res.json({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    })
  } catch (error) {
    console.error("Refresh Error:", error.response?.data || error.message)

    res.status(error.response?.status || 500).json({
      error: "Failed to refresh token",
    })
  }
})

export default router