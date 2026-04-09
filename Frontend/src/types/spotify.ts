export interface SpotifyImage {
    url: string
    height?: number
    width?: number
}
export interface Artist {
    name: string
    id: string
}
export interface Album {
    id: string
    name: string
    images: SpotifyImage[]
    artists?: Artist[]
}
export interface Track {
    id: string
    name: string
    artists: Artist[]
    album: Album
    duration_ms: number
    preview_url: string | null
    uri: string
}
export interface SavedTrackItem {
    added_at: string
    track: Track
}
export interface UserPlaylist {
    id: string
    name: string
    images: SpotifyImage[]
    description: string
    owner: { display_name: string; id: string }
    public: boolean
    tracks: { href: string; total: number }
    uri: string
}

export interface NewsArticle {
    title: string
    description: string | null
    url: string
    source: { name: string }
    publishedAt: string
}

export interface WeatherData {
    name: string
    main: { temp: number; feels_like: number; humidity: number }
    weather: { main: string; description: string; icon: string }[]
    wind: { speed: number }
}

export interface SearchResultItem {
    title: string
    link: string
    snippet: string
}