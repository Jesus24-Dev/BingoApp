import { LinkButton } from "../components/LinkButton"

export function Home(){
    return (
        <>
            <h1>Home page</h1>
            <LinkButton content="Ir a partida" linkTo="/match"/>
        </>
    )
}