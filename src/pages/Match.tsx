import { useState } from 'react';
import { BingoHost } from '../components/BingoHost';
import { BingoCard } from '../components/BingoCard';
import { BingoNumber } from '../types/bingo';

export function Match() {
    const [calledNumbers, setCalledNumbers] = useState<BingoNumber[]>([]);

    const handleNumberCalled = (bingoNumber: BingoNumber) => {
        setCalledNumbers(prev => [...prev, bingoNumber]);
    };

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BingoHost 
              onNumberCalled={handleNumberCalled}
            />
          </div>
          <div className="flex justify-center">
            <BingoCard calledNumbers={calledNumbers} />
          </div>
        </div>
      </div>
    );
}