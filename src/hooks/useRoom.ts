import {useState, useEffect} from 'react';
import { GameRoom, Player, BingoNumber, BingoWinner } from '../types/bingo';
import { Socket } from 'socket.io-client';

const useRoom = (socket: Socket | null) => {
    const [room, setRoom] = useState<GameRoom | null>(null);
    const [isHost, setIsHost] = useState<boolean>(false);
    const [player, setPlayer] = useState<Player | null>(null);
    const [winner, setWinner] = useState<BingoWinner[] | null>([]);
    const [calledNumbers, setCalledNumbers] = useState<BingoNumber[]>([]);
    const [currentNumber, setCurrentNumber] = useState<BingoNumber | null>(null); 
    const [hasJoined, setHasJoined] = useState<boolean>(false);
    
    useEffect(() => {
        if (!socket || hasJoined) {
            return;
        }

        const storedRoom = localStorage.getItem('roomId');
        const storedPlayer = localStorage.getItem('player');

        if (!storedRoom || !storedPlayer) {
            console.error("No roomId or player found in localStorage");
            return;
        }

        const parsedPlayer = JSON.parse(storedPlayer);
        setPlayer(parsedPlayer);

        socket.emit("join_room", storedRoom, parsedPlayer, 
            (response: {
                success: boolean; 
                isHost: boolean; 
                error?: string; 
                room?: GameRoom;
                player?: Player;
            }) => {
                if (response.success && response.room) {
                    setRoom(response.room);
                    setIsHost(response.isHost);
                    localStorage.setItem('player', JSON.stringify(response.player));
                    localStorage.setItem('room', JSON.stringify(response.room));
                    setHasJoined(true);
                } else if (response.error) {
                    console.error(response.error);
                }
            }
        );
        socket.on("room_update", (updatedRoom: GameRoom) => {
            setRoom(updatedRoom);
            localStorage.setItem('room', JSON.stringify(updatedRoom));   
            setCalledNumbers(updatedRoom.calledNumbers);
        });    

        socket.on("number_called", (number: BingoNumber) => {
            setCurrentNumber(number);
            setCalledNumbers((prev) => [...prev, number]);
        });

        socket.on("game_started", (room: GameRoom) => {
            setRoom(room);  
            setWinner(null);
        });

        socket.on("bingo_claimed", (winner: BingoWinner) => {   
            if (!winner) {
                setWinner(null);
                return;
            } 
            setWinner(prev => prev ? [...prev, winner] : [winner]);
        })

    }, [socket, hasJoined]); 

    return {room, isHost, player, calledNumbers, currentNumber, winner};
}

export default useRoom;