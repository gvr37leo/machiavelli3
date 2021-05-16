import React from "react"
import { Client } from "../../client"
import { Card } from "../models"
import { CardView } from "./card"
import { Modal } from "./modal"
import { RenderPlayer } from "./player"

export function RenderHomepage(props:{client:Client}){
    var game = props.client.store.getGame()
    var players = props.client.store.getPlayers()
    var sessionplayer = props.client.store.getSessionPlayer(props.client.sessionid)
    var boardcards = sessionplayer.childByName('board')._children() as Card[]
    var handcards = sessionplayer.childByName('hand')._children() as Card[]
    var currentplayer = props.client.store.getCurrentPlayer()

    return (
        <React.Fragment>
            <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
                <div style={{display:"flex", flexGrow: 1 ,alignItems: 'center'}}>
                    <div style={{marginLeft:'40px'}}>
                        {players.map(p => <RenderPlayer client={props.client} onClick={() => {
                            //show board/hand for this player
                        }} key={p.id} player={p} />)}
                    </div>
                    <div style={{flexGrow:1,display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:"center"}}>
                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            props.client.output.trigger({type:'specialability',data:null})
                        }}>special</div>

                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            props.client.output.trigger({type:'pass',data:null})
                        }}>pass</div>
                    </div>
                </div>
                <div style={{display:"flex", justifyContent:"center", flexWrap:"wrap", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {boardcards.map((c:Card) => <CardView onClick={() => {
                        
                    }} key={c.id} card={c} />)}
                </div>
                <div style={{display:"flex", justifyContent:"center", flexWrap:"wrap", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {handcards.map((c:Card) => <CardView onClick={() => {
                        props.client.output.trigger({type:'playcard',data:c.id})
                    }} key={c.id} card={c} />)}
                </div>
            </div>
            <Modal visible={sessionplayer.isDiscovering}>
                <div style={{padding:"20px", display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                    {sessionplayer.discoverOptions.map((option,i) => {
                        return <div>
                            {option.description}
                            {option.value}
                            <img key={i} width="180px" style={{cursor:"pointer", margin:"20px"}} src={`./resources/K${option.image}.jpg`}  onClick={() => {
                                props.client.output.trigger({type:'completediscovery',data:{data:option,id:sessionplayer.discoverid}})
                            }}></img>
                        </div>
                    })}
                </div>
            </Modal>
        </React.Fragment>
    )
}