import { BingoCardField } from './BingoCardField';

interface BingoCardColumnProps {
    values: (number | null)[];
    selectedNumbers: Set<number>;
  }
  
  export function BingoCardColumn({ values, selectedNumbers }: BingoCardColumnProps) {
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