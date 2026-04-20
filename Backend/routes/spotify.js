import express from "express"
import axios from "axios"
import { requireAuth } from "../middleware/requireAuth.js"

const router = express.Router()

// helper (clean + reusable)
const spotifyGet = async (url, token, params = {}) => {
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  })
}

// 👤 USER PROFILE
router.get("/user", requireAuth, async (req, res) => {
  try {
    const response = await spotifyGet(
      "https://api.spotify.com/v1/me",
      req.token
    )
    res.json(response.data)
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || "Failed to fetch user",
    })
  }
})

// 🎵 PLAYLISTS
router.get("/playlists", requireAuth, async (req, res) => {
  try {
    const response = await spotifyGet(
      "https://api.spotify.com/v1/me/playlists",
      req.token
    )
    res.json(response.data.items || [])
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch playlists",
    })
  }
})

// ❤️ LIKED SONGS
router.get("/liked-songs", requireAuth, async (req, res) => {
  try {
    const response = await spotifyGet(
      "https://api.spotify.com/v1/me/tracks",
      req.token
    )
    res.json(response.data.items || [])
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch liked songs",
    })
  }
})

// 🔥 TOP TRACKS
router.get("/top-tracks", requireAuth, async (req, res) => {
  try {
    const { limit = 20, offset = 0, time_range = "medium_term" } = req.query

    const response = await spotifyGet(
      "https://api.spotify.com/v1/me/top/tracks",
      req.token,
      { limit, offset, time_range }
    )

    res.json(response.data.items || [])
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch top tracks",
    })
  }
})

// 🔍 SEARCH TRACKS
router.get("/search", requireAuth, async (req, res) => {
  try {
    const q = req.query.q

    if (!q) {
      return res.status(400).json({ error: "Search query is required" })
    }

    const response = await spotifyGet(
      "https://api.spotify.com/v1/search",
      req.token,
      { q, type: "track", limit: 20 }
    )

    const tracks = response.data.tracks?.items || []

    const formatted = tracks.map((track) => ({
      id: track.id,
      name: track.name,
      uri: track.uri,
      artists: track.artists.map((a) => ({ name: a.name })),
      album: {
        name: track.album.name,
        images: track.album.images,
      },
      duration_ms: track.duration_ms,
    }))

    res.json(formatted)
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: "Failed to search tracks",
    })
  }
})

export default router