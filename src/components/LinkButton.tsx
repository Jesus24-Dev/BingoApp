import { useNavigate } from "react-router-dom"

interface LinkButton {
    content: string
    linkTo: string
}


export function LinkButton(props: LinkButton){
    const navigate = useNavigate()

    const handleLink = () => {
        navigate(props.linkTo)
    }

    return (
        <button onClick={handleLink}>{props.content}</button>
    )
}

