import { useState } from 'react';

interface RoomLobbyProps {
    onJoin: (roomId: string, playerName: string) => void;
  }
  
  export function RoomLobby({ onJoin }: RoomLobbyProps) {
    const [roomId, setRoomId] = useState('');
    const [playerName, setPlayerName] = useState('');
  
    const handleJoin = () => {
      if (roomId.trim() && playerName.trim()) {
        onJoin(roomId, playerName);
      }
    };
  
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Unirse al Bingo
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              Tu Nombre
            </label>
            <input
              id="playerName"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
              ID de Sala
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="Ej: SALA123"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <button
            onClick={handleJoin}
            disabled={!roomId.trim() || !playerName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Unirse a Sala
          </button>
        </div>
      </div>
    );
  }