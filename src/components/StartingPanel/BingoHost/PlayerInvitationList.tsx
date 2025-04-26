import { useState, useEffect } from "react";
import CopyLinkButton from "../../UI/CopyLinkButton";


function PlayerInvitationList() {
    const [roomId, setRoomId] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [userCards, setUserCards] = useState<number>(1)
    const [cards, setCards] = useState<string>('')

    const [currentUrl, setCurrentUrl] = useState<string>('')
    useEffect(() => {
        const room = localStorage.getItem('roomId')
        setCurrentUrl(window.location.href) 

        if (room){
            setRoomId(room)
        } 
        const cardsJson = `[${cards}]`
        setLink(`${currentUrl}?roomId=${roomId}&userCards=${userCards}&cards=${encodeURIComponent(cardsJson)}`)
    }, [currentUrl, roomId, userCards, cards])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUserCards(Number(value))
    }

    const handleChangeCards = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCards(`${value}`)
    }

    return (
        <div className='max-w-80'>
         <label className="text-xs mb-2">Ingrese numero de cartones para el jugador</label>
         <input type='number' 
            min={1} 
            max={100} 
            value={userCards}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">          
         </input>
         <label className="text-xs mb-2">Ingrese lista de cartones, separado por comas. Ejemplo: 15,16,17</label>
         <input type='string' 
            value={cards}
            onChange={handleChangeCards}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">          
         </input>
         <p className="text-xs my-2">{link}</p>
         <CopyLinkButton linkToCopy={link}/>
        </div>
    );
}

export default PlayerInvitationList;


