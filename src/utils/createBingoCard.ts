import { getBingoColumnNumbers } from "./getRandomNumbers";
import cards from '../data/bingo_cards.json';

type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O';
type BingoCardData = Record<BingoColumn, (number | null)[]>;

type BingoCards = Record<number, BingoCardData>;

const typedCards = cards as BingoCards;

export function createBingoCard(id: number): BingoCardData {

    try {
      const bingoCardData = typedCards[id];
      return {
        B: bingoCardData.B,
        I: bingoCardData.I,
        N: bingoCardData.N,
        G: bingoCardData.G,
        O: bingoCardData.O
      };
    } catch (e) {
      console.error('Card not fountdeed', e);
    }
  return {
    B: getBingoColumnNumbers('B'),
    I: getBingoColumnNumbers('I'),
    N: getBingoColumnNumbers('N'),
    G: getBingoColumnNumbers('G'),
    O: getBingoColumnNumbers('O')
  };
}
