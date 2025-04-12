import BingoLayout from "../layout/BingoLayout";
import { RoomLobby } from "../components/RoomLobby";
import StartingPanel from "../components/StartingPanel/BingoHost/StartingPanel"
import { useSocket } from "../hooks/useSocket";

function Bingo() {
    const {socket, logged, setIsLogged} = useSocket(import.meta.env.VITE_SOCKET_URL)

    const handleLogin = () => {        
        setIsLogged(true);
    }

    return (
        <BingoLayout socket={socket}>
            {!logged ? <RoomLobby handleLogin={handleLogin}/> : <StartingPanel socket={socket}/>}                               
        </BingoLayout>
    );
}

export default Bingo;