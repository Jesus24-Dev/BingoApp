import random from 'random';

export function getRandomNumbers(count: number, min: number, max: number): number[] {
  const numbers = new Set<number>();
  
  const availableNumbers = max - min + 1;
  const actualCount = Math.min(count, availableNumbers);
  
  while (numbers.size < actualCount) {
    numbers.add(random.int(min, max));
  }
  
  return Array.from(numbers);
}

export function getBingoColumnNumbers(letter: 'B' | 'I' | 'N' | 'G' | 'O'): (number | null)[] {
  switch (letter) {
    case 'B': return getRandomNumbers(5, 1, 15);
    case 'I': return getRandomNumbers(5, 16, 30);
    case 'N': return getRandomNumbers(5, 31, 45);
    case 'G': return getRandomNumbers(5, 46, 60);
    case 'O': return getRandomNumbers(5, 61, 75);
    default: return [];
  }
}