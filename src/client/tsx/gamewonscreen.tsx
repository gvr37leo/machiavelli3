import React from 'react'
import { Client } from "../../client"

export function GameWonScreen(props:{client:Client}){
    var game = props.client.store.getGame()
    var players = props.client.store.getPlayers()
    var winningplayer = players.find(p => p.id == game.winnerid)
    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", height:"100vh"}}>
        <div>{winningplayer?.name} has won the game</div>
        <button style={{marginTop:"50px"}} onClick={() => {
            props.client.input.emit('gamestart',null)
        }}>start new game</button>
    </div>
}