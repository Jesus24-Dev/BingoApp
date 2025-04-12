import { BingoWinner } from "../../../types/bingo";

interface WinnerBannerProps {
    winner: BingoWinner[] | null; 
    isHost: boolean;
}

const WinnerBanner = ({ winner, isHost }: WinnerBannerProps) => {
    if (!winner) return null;
 
    const uniqueWinners = winner.filter(
        (winner, index, self) => index === self.findIndex(w => w.winner.playerId === winner.winner.playerId)
      );

    return (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center p-4 mb-6 rounded-lg shadow-lg animate-pulse fixed">
            <h2 className="text-2xl font-bold">🎉 ¡BINGO! 🎉</h2>
            {isHost && uniqueWinners.length > 0  && (
                <>
                    {uniqueWinners.map((w, index) => (
                    <p key={index} className="text-lg">
                        {w.winner.playerName} ha ganado con el patrón: {w.winner.pattern}
                    </p>
                    ))}
                </>
            )}
        </div>
    );
};

export default WinnerBanner;