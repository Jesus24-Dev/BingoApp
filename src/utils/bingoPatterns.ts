import { BingoCard, BingoPattern, SelectedNumbers } from '../types/bingo';

export const checkBingo = (card: BingoCard, selectedNumbers: SelectedNumbers, pattern: BingoPattern): boolean => {
  switch (pattern) {
    case 'horizontal':
      return checkHorizontalLines(card, selectedNumbers);
    case 'vertical':
      return checkVerticalLines(card, selectedNumbers);
    case 'diagonal':
      return checkDiagonals(card, selectedNumbers);
    case 'four-corners':
      return checkFourCorners(card, selectedNumbers);
    case 'full-house':
      return checkFullHouse(card, selectedNumbers);
    default:
      return false;
  }
};

const checkHorizontalLines = (card: BingoCard, selectedNumbers: SelectedNumbers): boolean => {
  const rows = 5;
  for (let row = 0; row < rows; row++) {
    let complete = true;
    for (const column of ['B', 'I', 'N', 'G', 'O']) {
      const value = card[column][row];
      if (value !== null && !selectedNumbers.has(value)) {
        complete = false;
        break;
      }
    }
    if (complete) return true;
  }
  return false;
};

const checkVerticalLines = (card: BingoCard, selectedNumbers: SelectedNumbers): boolean => {
  for (const column of ['B', 'I', 'N', 'G', 'O']) {
    if (card[column].every(val => val === null || selectedNumbers.has(val))) {
      return true;
    }
  }
  return false;
};

const checkDiagonals = (card: BingoCard, selectedNumbers: SelectedNumbers): boolean => {
  let diagonal1 = true;
  let diagonal2 = true;
  
  for (let i = 0; i < 5; i++) {
    const val1 = card[['B', 'I', 'N', 'G', 'O'][i]][i];
    if (val1 !== null && !selectedNumbers.has(val1)) {
      diagonal1 = false;
    }
    
    const val2 = card[['B', 'I', 'N', 'G', 'O'][i]][4 - i];
    if (val2 !== null && !selectedNumbers.has(val2)) {
      diagonal2 = false;
    }
  }
  
  return diagonal1 || diagonal2;
};

const checkFourCorners = (card: BingoCard, selectedNumbers: SelectedNumbers): boolean => {
  const corners = [
    card['B'][0], 
    card['O'][0], 
    card['B'][4], 
    card['O'][4]  
  ];
  
  return corners.every(corner => corner === null || selectedNumbers.has(corner));
};

const checkFullHouse = (card: BingoCard, selectedNumbers: SelectedNumbers): boolean => {
  for (const column of ['B', 'I', 'N', 'G', 'O']) {
    for (const value of card[column]) {
      if (value !== null && !selectedNumbers.has(value)) {
        return false;
      }
    }
  }
  return true;
};