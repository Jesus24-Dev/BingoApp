import { useState } from "react";
import BingoLayout from "../layout/BingoLayout";
import { RoomLobby } from "../components/RoomLobby";
import StartingPanel from "../components/StartingPanel/BingoHost/StartingPanel"
import { useSocket } from "../hooks/useSocket";
function Bingo() {

    const {socket, token} = useSocket("http://localhost:3001")

    const [login, setLogin] = useState(false)

    const handleLogin = () => {
        setLogin(true)
    }

    return (
        <BingoLayout socket={socket}>
            {(!login || token === null) ? <RoomLobby handleLogin={handleLogin}/> : <StartingPanel socket={socket}/>}                               
        </BingoLayout>
    );
}

export default Bingo;