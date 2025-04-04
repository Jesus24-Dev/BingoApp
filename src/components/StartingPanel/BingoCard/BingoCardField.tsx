interface BingoCardFieldProps {
    value: number | null;
    isSelected: boolean;
  }
  
  export function BingoCardField({ value, isSelected }: BingoCardFieldProps) {
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