import { useState, useEffect } from "react";
import CopyLinkButton from "../../UI/CopyLinkButton";
import { createBingoCard } from "../../../utils/createBingoCard";

function PlayerInvitationList() {
    const [roomId, setRoomId] = useState<string>('')

    const [bingoCard, setBingoCard] = useState(createBingoCard())

    const updateCard = () => {
        setBingoCard(createBingoCard())
    }

    const bingoCardDataString = encodeURIComponent(JSON.stringify(bingoCard))

    const [currentUrl, setCurrentUrl] = useState<string>('')
    useEffect(() => {
        const room = localStorage.getItem('roomId')
        setCurrentUrl(window.location.href) 

        if (room){
            setRoomId(room)
        }     
    }, [])
    return (
         <CopyLinkButton linkToCopy={`${currentUrl}?roomId=${roomId}&bingoCard=${bingoCardDataString}`} loadNewCard={updateCard}/>
    );
}

export default PlayerInvitationList;


