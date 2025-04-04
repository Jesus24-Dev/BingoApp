import { useState, useEffect, useCallback } from 'react';
import { BingoNumber } from '../../types/bingo';

interface BingoHostProps {
  onNumberCalled: (number: BingoNumber) => void;
  onResetRequest?: () => void;
  isHost: boolean;
  initialNumbers?: BingoNumber[];
  gameStatus: 'waiting' | 'playing' | 'finished';
  currentNumber?: BingoNumber | null;
}

export function BingoHost({ 
  onNumberCalled, 
  onResetRequest,
  isHost, 
  initialNumbers = [], 
  gameStatus,
  currentNumber: externalCurrentNumber
}: BingoHostProps) {
  const [internalCurrentNumber, setInternalCurrentNumber] = useState<BingoNumber | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<BingoNumber[]>(initialNumbers);
  const [availableNumbers, setAvailableNumbers] = useState<BingoNumber[]>([]);

  // Sincronizar con el padre
  const currentNumber = externalCurrentNumber !== undefined ? externalCurrentNumber : internalCurrentNumber;

  useEffect(() => {
    if (initialNumbers.length > 0) {
      setCalledNumbers(initialNumbers);
      setInternalCurrentNumber(initialNumbers[initialNumbers.length - 1]);
    }
  }, [initialNumbers]);

  const generateBingoNumbers = useCallback(() => {
    const numbers: BingoNumber[] = [];
    const ranges = {
      B: { min: 1, max: 15 },
      I: { min: 16, max: 30 },
      N: { min: 31, max: 45 },
      G: { min: 46, max: 60 },
      O: { min: 61, max: 75 }
    };

    (Object.keys(ranges) as Array<keyof typeof ranges>).forEach(letter => {
      for (let i = ranges[letter].min; i <= ranges[letter].max; i++) {
        numbers.push({ number: i, letter, called: false });
      }
    });

    return numbers.sort(() => Math.random() - 0.5);
  }, []);

  const startGame = useCallback(() => {
    if (!isHost) return;
    
    const numbers = generateBingoNumbers();
    setAvailableNumbers(numbers);
    setCalledNumbers([]);
    setInternalCurrentNumber(null);
    onResetRequest?.();
  }, [isHost, generateBingoNumbers, onResetRequest]);

  const callNextNumber = useCallback(() => {
    if (!isHost || availableNumbers.length === 0) return;

    const nextNumber = availableNumbers[0];
    const newAvailableNumbers = availableNumbers.slice(1);

    setAvailableNumbers(newAvailableNumbers);
    setInternalCurrentNumber(nextNumber);
    setCalledNumbers(prev => [...prev, nextNumber]);
    onNumberCalled(nextNumber);
  }, [availableNumbers, isHost, onNumberCalled]);

  useEffect(() => {
    if (gameStatus === 'finished') {
      setAvailableNumbers([]);
    }
  }, [gameStatus]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isHost ? 'Anfitrión del Bingo' : 'Panel de Control'}
      </h2>
      
      <div className="mb-8 text-center">
        {currentNumber ? (
          <div className="animate-pulse">
            <div className="text-5xl font-bold mb-2">
              <span className="text-blue-600">{currentNumber.letter}</span>
              <span>-</span>
              <span>{currentNumber.number}</span>
            </div>
            <p className="text-gray-600">
              Números llamados: {calledNumbers.length}/75
            </p>
          </div>
        ) : (
          <p className="text-gray-500 py-8">
            {gameStatus === 'waiting' 
              ? 'Esperando al anfitrión...' 
              : 'Presiona "Llamar número"'}
          </p>
        )}
      </div>

      {isHost && (
        <div className="flex flex-col space-y-4">
          {gameStatus !== 'playing' ? (
            <button
              onClick={startGame}
              disabled={gameStatus === 'finished'}
              className={`py-3 px-6 rounded-lg font-medium text-lg ${
                gameStatus === 'finished' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {gameStatus === 'finished' ? 'Juego Terminado' : 'Iniciar Juego'}
            </button>
          ) : (
            <button
              onClick={callNextNumber}
              disabled={availableNumbers.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
            >
              {availableNumbers.length === 0 ? 'Todos los números usados' : 'Llamar Número'}
            </button>
          )}
        </div>
      )}

      {calledNumbers.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Números llamados:</h3>
          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-100 rounded">
            {calledNumbers.map((num, index) => (
              <div 
                key={`${num.letter}-${num.number}-${index}`}
                className={`text-center py-1 rounded ${
                  num === currentNumber ? 'bg-yellow-200' : 'bg-white'
                }`}
              >
                {num.letter}-{num.number}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}