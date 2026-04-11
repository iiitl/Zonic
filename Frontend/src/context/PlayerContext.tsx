import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

interface PlayerState {
    trackUri: string | null;
    trackName: string | null;
    artistName: string | null;
}

interface PlayerContextProps {
    playerState: PlayerState;
    setPlayerState: Dispatch<SetStateAction<PlayerState>>;
}

const defaultState: PlayerState = {
    trackUri: null,
    trackName: null,
    artistName: null,
};

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

interface PlayerProviderProps {
    children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
    const [playerState, setPlayerState] = useState<PlayerState>(() => {
        const savedState = localStorage.getItem('playerState');
        return savedState ? JSON.parse(savedState) : defaultState;
    });

    useEffect(() => {
        localStorage.setItem('playerState', JSON.stringify(playerState));
    }, [playerState]);

    return (
        <PlayerContext.Provider value={{ playerState, setPlayerState }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayerContext = (): PlayerContextProps => {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayerContext must be used within a PlayerProvider');
    }
    return context;
};