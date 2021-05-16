import React from 'react'
import { Client } from '../../client'
import { Player } from '../models'

export function RenderPlayer(props:{player:Player, client:Client, onClick?}){
    var currentplayer = props.client.store.getCurrentPlayer()
    var sessionplayer = props.client.store.getSessionPlayer(props.client.sessionid)
    var boardcards = props.player.childByName('board')._children()
    var handcards = props.player.childByName('hand')._children()
    var bordercolor = 'white'
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