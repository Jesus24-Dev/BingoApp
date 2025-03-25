import { useState, useEffect } from 'react';
import { getBingoColumnNumbers } from '../utils/getRandomNumbers';
import { checkBingo } from '../utils/bingoPatterns';
import { BingoPattern } from '../types/bingo';

export function BingoCard() {
  const [card] = useState({
    B: getBingoColumnNumbers('B'),
    I: getBingoColumnNumbers('I'),
    N: getBingoColumnNumbers('N'),
    G: getBingoColumnNumbers('G'),
    O: getBingoColumnNumbers('O')
  });
  
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [winningPattern, setWinningPattern] = useState<BingoPattern | null>(null);

  const handleNumberClick = (value: number | null) => {
    if (value !== null) {
      const newSelected = new Set(selectedNumbers);
      if (newSelected.has(value)) {
        newSelected.delete(value);
      } else {
        newSelected.add(value);
      }
      setSelectedNumbers(newSelected);
    }
  };

  useEffect(() => {
    const patterns: BingoPattern[] = [
      'horizontal', 
      'vertical', 
      'diagonal',
      'four-corners',
      'full-house'
    ];
    
    for (const pattern of patterns) {
      if (checkBingo(card, selectedNumbers, pattern)) {
        setWinningPattern(pattern);
        console.log(`¡BINGO! Patrón: ${pattern}`);
        break;
      }
    }
  }, [selectedNumbers, card]);

  return (
    <section className="mx-auto max-w-sm flex flex-col items-center bg-blue-200 p-4 rounded-lg shadow-lg">
      <h1 className="text-center text-6xl tracking-wider text-white font-bold mb-4">B I N G O</h1>
      {winningPattern && (
        <div className="mb-4 p-2 bg-yellow-400 text-black font-bold rounded">
          ¡BINGO! ({winningPattern})
        </div>
      )}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {['B', 'I', 'N', 'G', 'O'].map(letter => (
          <BingoCardColumn 
            key={letter}
            values={card[letter]} 
            selectedNumbers={selectedNumbers}
            onNumberClick={handleNumberClick}
          />
        ))}
      </div>
    </section>
  );
}

function BingoCardField({ value, isSelected, onClick }: { 
  value: number | null; 
  isSelected: boolean; 
  onClick: () => void 
}) {
  return (
    <button
      className={`text-center text-xl h-14 w-14 border-2 border-gray-200 transition-colors ${
        isSelected ? 'bg-blue-500 text-white' : 
        value === null ? 'bg-gray-300 cursor-default' : 
        'bg-white hover:bg-blue-100 text-black'
      }`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function BingoCardColumn({ values, selectedNumbers, onNumberClick }: { 
  values: number[]; 
  selectedNumbers: Set<number>;
  onNumberClick: (value: number | null) => void;
}) {
  return (
    <div className="grid grid-rows-5 gap-1">
      {values.map((value, index) => (
        <BingoCardField 
          key={`${value}-${index}`}
          value={value}
          isSelected={value !== null && selectedNumbers.has(value)}
          onClick={() => onNumberClick(value)}
        />
      ))}
    </div>
  );
}