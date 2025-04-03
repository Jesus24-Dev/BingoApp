import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { BingoHost } from '../components/BingoHost';
import { BingoCard } from '../components/BingoCard';
import { PlayerList } from '../components/PlayerList';
import { RoomLobby } from '../components/RoomLobby';
import { GameRoom, BingoNumber, BingoWinner, BingoPattern } from '../types/bingo';

export function Match() {
  const socket = useSocket('http://localhost:3001');
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [calledNumbers, setCalledNumbers] = useState<BingoNumber[]>([]);
  const [currentNumber, setCurrentNumber] = useState<BingoNumber | null>(null);
  const [winner, setWinner] = useState<BingoWinner | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Manejar conexión del socket
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log('Conectado al servidor');
      setConnectionStatus('connected');
    };

    const onDisconnect = () => {
      console.log('Desconectado del servidor');
      setConnectionStatus('disconnected');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  // Unirse a sala
  const joinRoom = (roomId: string, playerName: string) => {
    if (!socket || !roomId.trim() || !playerName.trim()) return;

    socket.emit('join_room', roomId, playerName, (response: {
      success: boolean;
      isHost: boolean;
      error?: string;
      room?: GameRoom;
    }) => {
      if (response.success && response.room) {
        setIsHost(response.isHost);
        setRoom(response.room);
        setCalledNumbers(response.room.calledNumbers);
      } else {
        alert(response.error || 'Error al unirse a la sala');
      }
    });
  };

  // Iniciar juego (solo host)
  const startGame = () => {
    if (room && isHost) {
      socket?.emit('start_game', room.id);
    }
  };

  // Llamar número (solo host)
  const callNumber = (number: BingoNumber | null) => {
    if (number && room && isHost) {
      socket?.emit('call_number', room.id, number);
    } else if (number === null && room?.id) {
      socket?.emit('reset_numbers', room.id);
    }
  };

  // Cantar BINGO
  const claimBingo = (pattern: BingoPattern) => {
    return new Promise<boolean>((resolve) => {
      if (!room || !socket) {
        resolve(false);
        return;
      }
  
      socket.emit(
        'claim_bingo', 
        room.id, 
        pattern, 
        (isValid: boolean) => {
          if (isValid) {
            console.log('BINGO validado correctamente');
          } else {
            console.log('BINGO no fue validado');
          }
          resolve(isValid);
        }
      );
    });
  };

  // Escuchar eventos del servidor
  useEffect(() => {
    if (!socket) return;

    const onRoomUpdate = (updatedRoom: GameRoom) => {
      setRoom(updatedRoom);
      setCalledNumbers(updatedRoom.calledNumbers);
    };

    const onNumberCalled = (number: BingoNumber) => {
      setCurrentNumber(number);
      setCalledNumbers(prev => [...prev, number]);
    };

    const onGameStarted = (room: GameRoom) => {
      setRoom(room);
      setWinner(null);
    };

    const onBingoClaimed = (winnerInfo: BingoWinner) => {
      setWinner(winnerInfo);
    };

    socket.on('room_update', onRoomUpdate);
    socket.on('number_called', onNumberCalled);
    socket.on('game_started', onGameStarted);
    socket.on('bingo_claimed', onBingoClaimed);

    return () => {
      socket.off('room_update', onRoomUpdate);
      socket.off('number_called', onNumberCalled);
      socket.off('game_started', onGameStarted);
      socket.off('bingo_claimed', onBingoClaimed);
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-6">
      {/* Barra de estado de conexión */}
      <div className={`fixed top-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow-md ${
        connectionStatus === 'connected' ? 'bg-green-500 text-white' : 
        connectionStatus === 'connecting' ? 'bg-yellow-500 text-white' : 
        'bg-red-500 text-white'
      }`}>
        {connectionStatus === 'connected' ? 'Conectado' : 
         connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        {!room ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <RoomLobby onJoin={joinRoom} />
          </div>
        ) : (
          <>
            {/* Banner de ganador */}
            {winner && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center p-4 mb-6 rounded-lg shadow-lg animate-pulse">
                <h2 className="text-2xl font-bold">🎉 ¡BINGO! 🎉</h2>
                <p className="text-lg">
                  {winner.playerName} ha completado: {winner.pattern}
                </p>
              </div>
            )}

            {/* Layout del juego */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda - Host y controles */}
              <div className="lg:col-span-2 space-y-6">
                <BingoHost
                  isHost={isHost}
                  gameStatus={room.status}
                  currentNumber={currentNumber}
                  initialNumbers={room.calledNumbers}
                  onNumberCalled={callNumber}
                />

                {room.status === 'waiting' && isHost && (
                  <button
                    onClick={startGame}
                    disabled={room.players.length < 2}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {room.players.length < 2 ? 
                      'Esperando más jugadores...' : 
                      'Iniciar Juego'}
                  </button>
                )}
              </div>

              {/* Columna derecha - Cartón y jugadores */}
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <BingoCard 
                    calledNumbers={calledNumbers} 
                    onBingoClaimed={claimBingo}
                  />
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md">
                  <PlayerList 
                    players={room.players} 
                    currentPlayerId={socket?.id || ''}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}