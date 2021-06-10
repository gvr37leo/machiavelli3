import React from 'react'
import { Client } from "../client"

export function GameWonScreen(props){
    let game = props.client.store.getGame()
    let players = props.client.store.getPlayers()
    let winningplayer = players.find(p => p.id == game.winnerid)
    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", height:"100vh"}}>
        <div>{winningplayer?.name} has won the game</div>
        <button style={{marginTop:"50px"}} onClick={() => {
            props.client.input.emit('gamestart',null)
        }}>start new game</button>
    </div>
}