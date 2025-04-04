import { Player } from '../../types/bingo';

interface PlayerListProps {
    players: Player[];
    currentPlayerId: string;
}

  export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">
          Jugadores ({players.length})
        </h3>
        <ul className="space-y-2">
          {players.map((player) => (
            <li 
              key={player.id}
              className={`flex items-center p-2 rounded-md ${
                player.id === currentPlayerId ? 
                  'bg-blue-100 border-l-4 border-blue-500' : 
                  'bg-gray-50'
              }`}
            >
              <span className="font-medium text-gray-800">
                {player.name}
              </span>
              {player.isHost && (
                <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Host
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }