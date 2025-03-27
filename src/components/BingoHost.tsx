import { useState, useEffect, useCallback } from 'react';
import { BingoNumber, BingoGameState } from '../types/bingo';

interface BingoHostProps {
    onNumberCalled: (bingoNumber: BingoNumber) => void;
}

export function BingoHost({ onNumberCalled }: BingoHostProps) {
  const [gameState, setGameState] = useState<BingoGameState>({
    calledNumbers: [],
    currentNumber: null,
    gameStarted: false,
    gameEnded: false
  });

  // Generar todos los números posibles del bingo
  const generateAllBingoNumbers = useCallback((): BingoNumber[] => {
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

    return numbers.sort(() => Math.random() - 0.5); // Mezclar los números
  }, []);

  const [availableNumbers, setAvailableNumbers] = useState<BingoNumber[]>([]);

  // Inicializar el juego
  const startGame = useCallback(() => {
    const numbers = generateAllBingoNumbers();
    setAvailableNumbers(numbers);
    setGameState({
      calledNumbers: [],
      currentNumber: null,
      gameStarted: true,
      gameEnded: false
    });
  }, [generateAllBingoNumbers]);

  // Llamar un nuevo número
  const callNextNumber = useCallback(() => {
    if (availableNumbers.length === 0) {
        setGameState(prev => ({ ...prev, gameEnded: true }));
        return;
      }
    
      const nextNumber = availableNumbers[0];
      const newAvailableNumbers = availableNumbers.slice(1);
    
      setAvailableNumbers(newAvailableNumbers);
      setGameState(prev => ({
        ...prev,
        calledNumbers: [...prev.calledNumbers, nextNumber],
        currentNumber: nextNumber
      }));
      
      // Llamar a la función prop para notificar al componente padre
      onNumberCalled(nextNumber);
  }, [availableNumbers, onNumberCalled]);

  // Efecto para limpiar al desmontar
  useEffect(() => {
    return () => {
      // Limpieza si es necesaria
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Anfitrión del Bingo</h2>
      
      <div className="mb-8">
        {gameState.currentNumber ? (
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              <span className="text-blue-600">{gameState.currentNumber.letter}</span>
              <span>-</span>
              <span>{gameState.currentNumber.number}</span>
            </div>
            <p className="text-gray-600">
              Números llamados: {gameState.calledNumbers.length}/75
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            {gameState.gameStarted ? 'Presiona "Llamar número"' : 'Presiona "Iniciar Juego"'}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        {!gameState.gameStarted ? (
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
          >
            Iniciar Juego
          </button>
        ) : (
          <>
            <button
              onClick={callNextNumber}
              disabled={gameState.gameEnded}
              className={`py-3 px-6 rounded-lg font-medium text-lg ${
                gameState.gameEnded 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {gameState.gameEnded ? 'Juego Terminado' : 'Llamar Número'}
            </button>

            {gameState.gameEnded && (
              <button
                onClick={startGame}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
              >
                Reiniciar Juego
              </button>
            )}
          </>
        )}
      </div>

      {gameState.calledNumbers.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Números llamados:</h3>
          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-100 rounded">
            {gameState.calledNumbers.map((num, index) => (
              <div 
                key={`${num.letter}-${num.number}-${index}`}
                className="text-center py-1 bg-white rounded"
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