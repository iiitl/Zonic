import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu } from "@/components/ui/menu"
import { Sidebar } from "@/components/ui/sidebar"
import SpotifyEmbedPlayer from "@/components/ui/spotify-embed-player"
import { usePlayerContext } from "@/context/PlayerContext"
import { UserPlaylist } from "../../types/spotify"

function GlobalPlayer() {
  const { playerState } = usePlayerContext()
  return <SpotifyEmbedPlayer trackUri={playerState.trackUri} />
}

export type LayoutContextType = {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  userPlaylists: UserPlaylist[]
  setUserPlaylists: React.Dispatch<React.SetStateAction<UserPlaylist[]>>
  setHandleSearch: React.Dispatch<React.SetStateAction<() => void>>
  setHandlePlaylistSelect: React.Dispatch<React.SetStateAction<(id: string, name: string) => void>>
}

export function AppLayout() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([])

  // Store the callback actions that child pages might register
  const [handleSearch, setHandleSearch] = useState<() => void>(() => () => {})
  const [handlePlaylistSelect, setHandlePlaylistSelect] = useState<(id: string, name: string) => void>(
    () => () => {}
  )

  const contextValue: LayoutContextType = {
    searchQuery,
    setSearchQuery,
    userPlaylists,
    setUserPlaylists,
    setHandleSearch,
    setHandlePlaylistSelect,
  }

  return (
    <>
      {/* Mobile Fallback  */}
      <div className="md:hidden">
        <p className="p-4 text-center bg-black text-white h-screen flex items-center justify-center">
          This experience is designed for larger screens.
        </p>
      </div>

      {/* Main Desktop Layout */}
      <div className="hidden md:flex h-screen flex-col">
        <Menu searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={handleSearch} />
        
        <div className="border-t flex-grow overflow-hidden">
          <div className="bg-background h-full">
            <div className="grid lg:grid-cols-5 h-full">
              <Sidebar
                playlists={userPlaylists}
                className="hidden lg:block h-full overflow-y-auto"
                onPlaylistSelect={handlePlaylistSelect}
              />
              
              {/* Main Content Area */}
              <div className="col-span-3 lg:col-span-4 lg:border-l h-full flex flex-col relative">
                <div className="flex-grow overflow-y-auto w-full">
                  <Outlet context={contextValue} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Player */}
        <GlobalPlayer />
      </div>
    </>
  )
}

export default AppLayout
