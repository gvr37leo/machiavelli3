import React from 'react'
import { Client } from '../client'
import { Player } from '../../shared/models'

export function RenderPlayer(props:{player:Player, client:Client, onClick?}){
    let currentplayer = props.client.store.getCurrentPlayer()
    let sessionplayer = props.client.store.getClientPlayer(props.client.socket.serverclientid)
    let boardcards = props.player.childByName('board')._children()
    let handcards = props.player.childByName('hand')._children()
    let bordercolor = 'white'
    if(currentplayer.id == props.player.id){
        bordercolor = 'red'
    }

    return (<div style={{margin:'10px', padding:'10px', border:`1px solid ${bordercolor}`}}>
        <div>{props.player.name} {sessionplayer.id == props.player.id ? "(yourself)" : ""} {props.player.disconnected ? "(disconnected)" : ""}</div>
        <div>{boardcards.length}</div>
        <div>money</div>
        <div>handsize</div>
        <div>boardsize points</div>
        <div>name</div>
        <div>crown</div>
        <div onClick={props.onClick}></div>
    </div>)
}