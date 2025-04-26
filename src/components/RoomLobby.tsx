import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type RoomLobbyProps = {
  handleLogin: () => void;
}

  export function RoomLobby({handleLogin}: RoomLobbyProps) {
    const [playerName, setPlayerName] = useState('');
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get('roomId'); 
    const userCards = searchParams.get('userCards'); 
    const handlePlayerName = (event: React.ChangeEvent<HTMLInputElement>) =>{
      setPlayerName(event.target.value);
    }
          const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
                const response = await fetch(import.meta.env.VITE_APIPOST_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ playerName })
                });
        
                const data = await response.json();
                if (data.success) {
                  if(data.player.isHost){
                      localStorage.setItem('roomId', data.roomId); 
                      localStorage.setItem('player', JSON.stringify(data.player));
                      localStorage.setItem('token', data.token);
                      handleLogin()
                  } else {
                    if(roomId && userCards){
                      localStorage.setItem('roomId', roomId); 
                      localStorage.setItem('player', JSON.stringify(data.player));
                      localStorage.setItem('token', data.token);
                      localStorage.setItem('userCardsLength', userCards);
                      handleLogin()
                    }
                  }                                     
                }           
    
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
               
              <button
                type='submit'
                disabled={!playerName.trim()}
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