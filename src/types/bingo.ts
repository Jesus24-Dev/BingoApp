export type BingoPattern = 'horizontal' | 'vertical' | 'diagonal' | 'four-corners' | 'full-house';

export type BingoCard = Record<string, (number | null)[]>;

export type SelectedNumbers = Set<number>;

export type BingoNumber = {
    number: number;
    letter: 'B' | 'I' | 'N' | 'G' | 'O';
    called: boolean;
};
  
export type BingoGameState = {
    calledNumbers: BingoNumber[];
    currentNumber: BingoNumber | null;
    gameStarted: boolean;
    gameEnded: boolean;
};