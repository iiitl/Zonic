import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { PlayerProvider } from "./context/PlayerContext"; 
import MusicPage from "@/pages/music";
import InsightsPage from "@/pages/insights";
import { AppLayout } from "@/components/layout/AppLayout";

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider> {/* Provider wraps everything */}
        <Router>
          {/* Define the Routes - Pages will render here */}
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<MusicPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
      {/* <CustomCursor />  */}
    </ThemeProvider>
  );
}

export default App;

