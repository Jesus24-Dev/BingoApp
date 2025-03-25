export type BingoPattern = 'horizontal' | 'vertical' | 'diagonal' | 'four-corners' | 'full-house';
export type BingoCard = Record<string, (number | null)[]>;
export type SelectedNumbers = Set<number>;