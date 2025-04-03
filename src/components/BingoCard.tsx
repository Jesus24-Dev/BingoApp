import { useState, useEffect, useMemo } from 'react';
import { getBingoColumnNumbers } from '../utils/getRandomNumbers';
import { checkBingo } from '../utils/bingoPatterns';
import { BingoPattern, BingoNumber } from '../types/bingo';

interface BingoCardProps {
  calledNumbers: BingoNumber[];
  onBingoClaimed?: (pattern: BingoPattern) => Promise<boolean>;
}

type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O';
type BingoCardData = Record<BingoColumn, (number | null)[]>;

export function BingoCard({ calledNumbers, onBingoClaimed }: BingoCardProps) {
  const [card] = useState<BingoCardData>({
    B: getBingoColumnNumbers('B'),
    I: getBingoColumnNumbers('I'),
    N: getBingoColumnNumbers('N'),
    G: getBingoColumnNumbers('G'),
    O: getBingoColumnNumbers('O')
  });
  
  const [winningPattern, setWinningPattern] = useState<BingoPattern | null>(null);

  const selectedNumbers = useMemo(
    () => new Set(calledNumbers.map(n => n.number)),
    [calledNumbers]
  );

  useEffect(() => {
    const patterns: BingoPattern[] = [
      'horizontal', 
      'vertical', 
      'diagonal',
      'four-corners',
      'full-house'
    ];
    
    const checkForBingo = async () => {
      for (const pattern of patterns) {
        if (checkBingo(card, selectedNumbers, pattern)) {
          setWinningPattern(pattern);
          const isValid = await onBingoClaimed?.(pattern) ?? false;
          if (isValid) break;
        }
      }
    };
  
    checkForBingo();
  
    return () => {
      setWinningPattern(null);
    };
  }, [calledNumbers, card, selectedNumbers, onBingoClaimed]);

  return (
    <section className="mx-auto max-w-sm flex flex-col items-center bg-blue-200 p-4 rounded-lg shadow-lg">
      <h1 className="text-center text-6xl tracking-wider text-white font-bold mb-4">B I N G O</h1>
      {winningPattern && (
        <div className="mb-4 p-2 bg-yellow-400 text-black font-bold rounded">
          ¡BINGO! ({winningPattern})
        </div>
      )}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {(Object.keys(card) as BingoColumn[]).map(letter => (
          <BingoCardColumn 
            key={letter}
            values={card[letter]} 
            selectedNumbers={selectedNumbers}
          />
        ))}
      </div>
    </section>
  );
}

interface BingoCardColumnProps {
  values: (number | null)[];
  selectedNumbers: Set<number>;
}

function BingoCardColumn({ values, selectedNumbers }: BingoCardColumnProps) {
  return (
    <div className="grid grid-rows-5 gap-1">
      {values.map((value, index) => (
        <BingoCardField 
          key={`${value}-${index}`}
          value={value}
          isSelected={value !== null && selectedNumbers.has(value)}
        />
      ))}
    </div>
  );
}

interface BingoCardFieldProps {
  value: number | null;
  isSelected: boolean;
}

function BingoCardField({ value, isSelected }: BingoCardFieldProps) {
  return (
    <div
      className={`text-center text-xl h-14 w-14 border-2 border-gray-200 flex items-center justify-center ${
        isSelected ? 'bg-blue-500 text-white' : 
        value === null ? 'bg-gray-300' : 
        'bg-white text-black'
      }`}
    >
      {value}
    </div>
  );
}