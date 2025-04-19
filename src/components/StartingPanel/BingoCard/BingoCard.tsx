import { useState, useEffect, useMemo } from 'react';
import { checkBingo } from '../../../utils/bingoPatterns';
import { BingoPattern, BingoNumber } from '../../../types/bingo';
import { BingoCardColumn } from './BingoCardColumn';
import { createBingoCard } from '../../../utils/createBingoCard';
import { useSearchParams } from 'react-router-dom';

interface BingoCardProps {
  calledNumbers: BingoNumber[];
  onBingoClaimed?: (pattern: BingoPattern) => Promise<boolean>;
}

type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O';
type BingoCardData = Record<BingoColumn, (number | null)[]>;

export function BingoCard({ calledNumbers, onBingoClaimed }: BingoCardProps) {

  const [searchParams] = useSearchParams();
  const bingoCard = searchParams.get('bingoCard');

  const [card] = useState<BingoCardData>(createBingoCard(bingoCard));
  
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
      <h1 className="text-center text-5xl tracking-wider text-white font-bold mb-4">B I N G O</h1>
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
