import { Socket } from "socket.io-client";
import { BingoHost } from "./BingoHost";
import WinnerBanner from "./WinnerBanner";
import { BingoCard } from "../BingoCard/BingoCard";
import { PlayerList } from "./PlayerList";
import { BingoNumber, BingoPattern } from "../../../types/bingo";
import useRoom from "../../../hooks/useRoom";
import PlayerInvitationList from "./PlayerInvitationList";
import { BingoBoard } from "../BingoCard/BingoBoard";
import { v4 as uuidv4 } from 'uuid';

type StartingPanelProps = {
  socket: Socket | null;
};

function StartingPanel({ socket }: StartingPanelProps) {
  //TODO: Conectar el socket para establecer estas funciones
  const { room, isHost, calledNumbers, currentNumber, winner } =
    useRoom(socket);

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
  };

  const createNewRoom = () => {
    const uuidRoom = uuidv4();
    if (room && isHost) {
      socket?.emit("changeIdRoom", uuidRoom)
    }
  }
  if (!room) {
    return null;
  }

  return (
    <>
      {winner?.length !== 0 && <WinnerBanner winner={winner} isHost={isHost} />}
      {/* Layout del juego */}
      {isHost ? (
        <div className="space-y-6">
          {/* Primera fila: BingoHost + PlayerList */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 flex">
              <PlayerInvitationList />
              <button onClick={createNewRoom} className="bg-blue-500 text-white p-4 max-h-10">Generar nueva sala</button>
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
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <PlayerList
                  players={room.players}
                  currentPlayerId={socket?.id || ""}
                />
              </div>
            </div>
          </div>

          {/* Segunda fila: BingoBoard a lo ancho */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <BingoBoard calledNumbers={calledNumbers} />
          </div>
        </div>
      ) : (
        // Diseño original para no-host
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <BingoCard
                calledNumbers={calledNumbers}
                onBingoClaimed={claimBingo}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StartingPanel;
