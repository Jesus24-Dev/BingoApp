import { useMemo } from "react";
import { BingoNumber } from "../../../types/bingo";

type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O';

interface BingoBoardProps {
    calledNumbers: BingoNumber[];
  }
  
  export function BingoBoard({ calledNumbers }: BingoBoardProps) {
    const selectedNumbers = useMemo(
      () => new Set(calledNumbers.map(n => n.number)),
      [calledNumbers]
    );
  
    const numberGroups = useMemo(() => {
      const groups: Record<string, number[]> = {
        B: [], I: [], N: [], G: [], O: []
      };
      
      for (let i = 1; i <= 75; i++) {
        if (i <= 15) groups.B.push(i);
        else if (i <= 30) groups.I.push(i);
        else if (i <= 45) groups.N.push(i);
        else if (i <= 60) groups.G.push(i);
        else groups.O.push(i);
      }
      
      return groups;
    }, []);
  
    return (
      <section className="mx-auto max-w-8xl flex flex-col items-center bg-blue-200 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-6xl tracking-wider text-white font-bold mb-6">Números del Bingo</h1>
        
        <div className="grid grid-cols-5 gap-4 w-full">
          {(Object.keys(numberGroups) as BingoColumn[]).map(letter => (
            <div key={letter} className="flex flex-col items-center">
              <h2 className="text-4xl font-bold text-white mb-3">{letter}</h2>
              <div className="grid grid-cols-5 gap-2">
                {numberGroups[letter].map(number => (
                  <BingoBoardNumber 
                    key={number}
                    number={number}
                    isCalled={selectedNumbers.has(number)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-white font-bold">
          Números llamados: {calledNumbers.length}/75
        </div>
      </section>
    );
  }
  
  interface BingoBoardNumberProps {
    number: number;
    isCalled: boolean;
  }
  
  function BingoBoardNumber({ number, isCalled }: BingoBoardNumberProps) {
    return (
      <div
        className={`text-center text-lg h-10 w-10 rounded-full flex items-center justify-center ${
          isCalled 
            ? 'bg-blue-800 text-white transform scale-110' 
            : 'bg-white text-blue-800'
        } transition-all duration-200`}
      >
        {number}
      </div>
    );
  }