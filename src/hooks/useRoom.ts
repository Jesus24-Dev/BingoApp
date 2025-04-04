import {useState, useEffect} from 'react';
import { GameRoom, BingoNumber } from '../types/bingo';

const useRoom = () =>  {
    const [room, setRoom] = useState<GameRoom | null>(null);
    const [isHost, setIsHost] = useState(false);
    const [calledNumbers, setCalledNumbers] = useState<BingoNumber[]>([]);
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);

    useEffect(() => {
        const room = localStorage.getItem('room');
        const isHost = localStorage.getItem('isHost') === 'true';
        const playerName = localStorage.getItem('playerName');
        const roomId = localStorage.getItem('roomId');
        const calledNumbers = localStorage.getItem('calledNumbers') || '[]';
        setRoom(room ? JSON.parse(room) : null);
        setIsHost(isHost);
        setPlayerName(playerName);
        setRoomId(roomId);  
        setCalledNumbers(JSON.parse(calledNumbers));
    }, [])

    return {room, setRoom, isHost, calledNumbers, setCalledNumbers, playerName, roomId}
}

export default useRoom;