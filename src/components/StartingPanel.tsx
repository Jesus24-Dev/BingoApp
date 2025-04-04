import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { BingoHost } from "../components/BingoHost";
import WinnerBanner from "../components/WinnerBanner";
import { BingoCard } from "../components/BingoCard";
import { PlayerList } from "../components/PlayerList";
import {GameRoom, BingoNumber, BingoWinner, BingoPattern} from "../types/bingo";
import useRoom from "../hooks/useRoom";

function StartingPanel() {
    const [winner, setWinner] = useState<BingoWinner | null>(null);
    const [currentNumber, setCurrentNumber] = useState<BingoNumber | null>(null);
    const socket = useSocket("http://localhost:3001");

    const {room, setRoom, isHost, calledNumbers, setCalledNumbers} = useRoom();

    // Iniciar juego (solo host)
    const startGame = () => {
        if (room && isHost) {
        socket?.emit("start_game", room.id);
        }
    };

    // Llamar número (solo host)
    const callNumber = (number: BingoNumber | null) => {
        if (number && room && isHost) {
        socket?.emit("call_number", room.id, number);
        } else if (number === null && room?.id) {
        socket?.emit("reset_numbers", room.id);
        }
    };

    // Cantar BINGO
    const claimBingo = (pattern: BingoPattern) => {
        return new Promise<boolean>((resolve) => {
        if (!room || !socket) {
            resolve(false);
            return;
        }

        socket.emit("claim_bingo", room.id, pattern, (isValid: boolean) => {
            if (isValid) {
            console.log("BINGO validado correctamente");
            } else {
            console.log("BINGO no fue validado");
            }
            resolve(isValid);
        });
        });
    };

    useEffect(() => {
        if (!socket) return;
    
        const onRoomUpdate = (updatedRoom: GameRoom) => {
          setRoom(updatedRoom);
          setCalledNumbers(updatedRoom.calledNumbers);
        };
    
        const onNumberCalled = (number: BingoNumber) => {
          setCurrentNumber(number);
          setCalledNumbers((prev) => [...prev, number]);
        };
    
        const onGameStarted = (room: GameRoom) => {
          setRoom(room);
          setWinner(null);
        };
    
        const onBingoClaimed = (winnerInfo: BingoWinner) => {
          setWinner(winnerInfo);
        };
    
        socket.on("room_update", onRoomUpdate);
        socket.on("number_called", onNumberCalled);
        socket.on("game_started", onGameStarted);
        socket.on("bingo_claimed", onBingoClaimed);
    
        return () => {
          socket.off("room_update", onRoomUpdate);
          socket.off("number_called", onNumberCalled);
          socket.off("game_started", onGameStarted);
          socket.off("bingo_claimed", onBingoClaimed);
        };
      }, [socket, setRoom, setCalledNumbers]);

      if (!room) { return null; } 

    return (
        <>       
          {winner && <WinnerBanner winner={winner} />}
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

              {room.status === "waiting" && isHost && (
                <button
                  onClick={startGame}
                  disabled={room.players.length < 2}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {room.players.length < 2
                    ? "Esperando más jugadores..."
                    : "Iniciar Juego"}
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
                  currentPlayerId={socket?.id || ""}
                />
              </div>
            </div>
          </div>
        </>
    );
}

export default StartingPanel;