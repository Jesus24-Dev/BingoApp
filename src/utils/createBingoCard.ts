import { getBingoColumnNumbers } from "./getRandomNumbers";

type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O';
type BingoCardData = Record<BingoColumn, (number | null)[]>;

export function createBingoCard(bingoCard?: string | null): BingoCardData {
  if (bingoCard) {
    try {
      const parsedCard = JSON.parse(bingoCard) as BingoCardData;
      if (parsedCard.B && parsedCard.I && parsedCard.N && parsedCard.G && parsedCard.O) {
        return parsedCard;
      }
    } catch (e) {
      console.error('Error al parsear bingoCardData del localStorage', e);
    }
  }
  return {
    B: getBingoColumnNumbers('B'),
    I: getBingoColumnNumbers('I'),
    N: getBingoColumnNumbers('N'),
    G: getBingoColumnNumbers('G'),
    O: getBingoColumnNumbers('O')
  };
}
