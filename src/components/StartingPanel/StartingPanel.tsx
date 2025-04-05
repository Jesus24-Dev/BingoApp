import { Socket } from "socket.io-client";
import { BingoHost } from "./BingoHost";
import WinnerBanner from "./WinnerBanner";
import { BingoCard } from "./BingoCard/BingoCard";
import { PlayerList } from "./PlayerList";
import {BingoNumber, BingoPattern} from "../../types/bingo";
import useRoom from "../../hooks/useRoom";

type StartingPanelProps = {
    socket: Socket | null;  
}

function StartingPanel({socket}: StartingPanelProps) {

  //TODO: Conectar el socket para establecer estas funciones
    const {room, isHost, calledNumbers, currentNumber, winner} = useRoom(socket);

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