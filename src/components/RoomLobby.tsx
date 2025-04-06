import { useState } from 'react';

type RoomLobbyProps = {
  handleLogin: () => void;
}

  export function RoomLobby({handleLogin}: RoomLobbyProps) {
    const [roomId, setRoomId] = useState('');
    const [playerName, setPlayerName] = useState('');
    const handlePlayerName = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setPlayerName(event.target.value);
    }

    const handleRoomId = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setRoomId(event.target.value);
    }

          const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const response = await fetch('http://localhost:3001/room', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ roomId, playerName })
            });
    
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('roomId', data.roomId); 
                localStorage.setItem('player', JSON.stringify(data.player));
            }
            handleLogin();
          }

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
                name='playerName'
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <form onSubmit={handleSubmit}>
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
                  name='roomId'
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
      
              <button
                type='submit'
                disabled={!roomId.trim() || !playerName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold my-2 py-3 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Unirse a Sala
              </button>
            </form>
            
          </div>
        </div>
      </div>
    );
  }