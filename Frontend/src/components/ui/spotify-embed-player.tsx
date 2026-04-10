import type React from "react";
interface SpotifyEmbedPlayerProps { trackUri: string | null; }
const SpotifyEmbedPlayer: React.FC<SpotifyEmbedPlayerProps> = ({ trackUri }) => {
    if (!trackUri) {
        return (
            <div className="fixed bottom-0 left-0 w-full h-[80px] bg-gradient-to-t from-black to-gray-900 border-t border-gray-700 flex items-center justify-center text-gray-500 text-sm z-50">
                Select a track to play
            </div>
        );
    }
    if (!trackUri.startsWith('spotify:track:')) {
        console.warn("Invalid URI passed to SpotifyEmbedPlayer:", trackUri);
        return <div className="fixed bottom-0 left-0 w-full h-[80px] bg-red-900 border-t border-red-700 flex items-center justify-center text-white text-sm z-50">Invalid Track URI</div>;
    }
    const trackId = trackUri.split(':')[2];
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;

    return (
        <div className="fixed bottom-0 left-0 w-full h-[80px] z-50 bg-gray-900">
            <iframe
                key={trackUri}
                title="Spotify Embed Player"
                style={{ borderRadius: '0px' }}
                src={embedUrl}
                width="100%"
                height="80"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="eager"
            ></iframe>
        </div>
    );
};

export default SpotifyEmbedPlayer;
