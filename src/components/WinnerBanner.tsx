import { BingoWinner } from "../types/bingo";

interface WinnerBannerProps {
    winner: BingoWinner | null; 
}

const WinnerBanner = ({ winner }: WinnerBannerProps) => {
    if (!winner) return null;
    return (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center p-4 mb-6 rounded-lg shadow-lg animate-pulse">
            <h2 className="text-2xl font-bold">🎉 ¡BINGO! 🎉</h2>
            <p className="text-lg">
                {winner.playerName} ha completado: {winner.pattern}
            </p>
        </div>
    );
};

export default WinnerBanner;