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
        if(typeof window === 'undefined'){
            return defaultState;
        }
    
        try{
            const savedState = window.localStorage.getItem('playerState');
            return savedState ? JSON.parse(savedState) : defaultState;
        } catch (error) {
            return defaultState;
        }
    });

    useEffect(() => {
        if(typeof window === 'undefined'){
            return;
        }

        try {
            window.localStorage.setItem('playerState', JSON.stringify(playerState));
        } catch (error) {
            console.error("Storage failed:", error);
        }
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
