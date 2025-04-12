import { Socket } from "socket.io-client";
import { BingoHost } from "./BingoHost";
import WinnerBanner from "./WinnerBanner";
import { BingoCard } from "../BingoCard/BingoCard";
import { PlayerList } from "./PlayerList";
import {BingoNumber, BingoPattern} from "../../../types/bingo";
import useRoom from "../../../hooks/useRoom";
import PlayerInvitationList from "./PlayerInvitationList";

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
              resolve(isValid);
          });
        });
    };

    const resetBingo = () => {
        if (room && isHost) {
            socket?.emit("reset_bingo", room.id);
        }
    }
    if (!room) { return null; } 

    return (
        <>       
          {winner?.length !== 0 && <WinnerBanner winner={winner} isHost={isHost} />}
          {/* Layout del juego */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Host y controles */}
            <div className="lg:col-span-2 space-y-6">
              {isHost && <PlayerInvitationList/>}    
              <BingoHost
                isHost={isHost}
                gameStatus={room.status}
                currentNumber={currentNumber}
                initialNumbers={room.calledNumbers}
                onNumberCalled={callNumber}
                onResetBingo={resetBingo}
                onStartGame={startGame}
              />
            </div>

            {/* Columna derecha - Cartón y jugadores */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <BingoCard
                  calledNumbers={calledNumbers}
                  onBingoClaimed={claimBingo}
                />
              </div>
              {isHost && (
                  <div className="bg-white p-4 rounded-xl shadow-md">
                  <PlayerList
                    players={room.players}
                    currentPlayerId={socket?.id || ""}
                  />
                </div>
              )}           
            </div>
          </div>
        </>
    );
}

export default StartingPanel;