import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../hooks/useSocket";
import { GameRoom } from '../types/bingo';

  export function RoomLobby() {
    const socket = useSocket('http://localhost:3001');
    const [roomId, setRoomId] = useState('');
    const [playerName, setPlayerName] = useState('');
    const navigate = useNavigate()
  
    const handleJoin = () => {
      if (roomId.trim() && playerName.trim()) {
        joinRoom(roomId, playerName);
      }
    };

    const handlePlayerName = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setPlayerName(event.target.value);
    }

    const handleRoomId = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setRoomId(event.target.value);
    }

    const joinRoom = (roomId: string, playerName: string) => {
            if (!socket || !roomId.trim() || !playerName.trim()) return;

            socket.emit(
              "join_room",
              roomId,
              playerName,
              (response: {
                success: boolean;
                isHost: boolean;
                error?: string;
                room?: GameRoom;
              }) => {
                if (response.success && response.room) {
                  localStorage.setItem('room', JSON.stringify(response.room));
                  localStorage.setItem('isHost', response.isHost.toString());
                } else {
                  console.error(response.error || "Error al unirse a la sala");
                  console.error(response.success)
                }
              }
            );
            navigate('/match')
          };

    return (
      <div className="flex items-center justify-center min-h-[80vh]">
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
                onChange={handlePlayerName}
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
                onChange={handleRoomId}
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
      </div>
    );
  }