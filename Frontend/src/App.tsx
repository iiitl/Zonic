// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { PlayerProvider, usePlayerContext } from "./context/PlayerContext"; // Import usePlayerContext
import MusicPage from "@/pages/music";
import InsightsPage from "@/pages/insights";


// --- Import or Define SpotifyEmbedPlayer here ---
import SpotifyEmbedPlayer from "@/components/ui/spotify-embed-player";
// --------------------------------------------------


// --- New component to render the player using context ---
function GlobalPlayer() {
    const { playerState } = usePlayerContext(); // Get state from context
    return <SpotifyEmbedPlayer trackUri={playerState.trackUri} />;
}
// --------------------------------------------------


function App() {
  return (
    <ThemeProvider>
      <PlayerProvider> {/* Provider wraps everything */}
        <Router>
          {/* Define the Routes - Pages will render here */}
          <Routes>
            <Route path="/" element={<MusicPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>

          {/* Render the player OUTSIDE Routes */}
          {/* It will persist across page navigations */}
          <GlobalPlayer /> {/* <-- Render the player using context */}

        </Router>
      </PlayerProvider>
      {/* <CustomCursor />  */}
    </ThemeProvider>
  );
}

export default App;
