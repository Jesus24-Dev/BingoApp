export type BingoPattern = 'horizontal' | 'vertical' | 'diagonal' | 'four-corners' | 'full-house';

export type BingoCard = Record<string, (number | null)[]>;

export type SelectedNumbers = Set<number>;

export type BingoNumber = {
    number: number;
    letter: 'B' | 'I' | 'N' | 'G' | 'O';
    called: boolean;
};

export type BingoWinner = {
    winner: {
        playerId: string;
        playerName: string;
        pattern: string;
    } 
};
  
export type BingoGameState = {
    calledNumbers: BingoNumber[];
    currentNumber: BingoNumber | null;
    gameStarted: boolean;
    gameEnded: boolean;
};

export type Player = {
    id: string;
    name: string;
    isHost: boolean;
};

export type GameRoom = {
    id: string;
    players: Player[];
    calledNumbers: BingoNumber[];
    status: 'waiting' | 'playing' | 'finished';
};

export type StatusBarProps = {
    connectionStatus: 'connecting' | 'connected' | 'disconnected'
}