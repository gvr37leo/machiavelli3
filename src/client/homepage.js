import React from "react"
import { Client } from "../client"
import { Card } from "../../shared/models"
import { CardView } from "./card"
import { Modal } from "./modal"
import { RenderPlayer } from "./player"

export function RenderHomepage({client}){
    let game = client.store.getGame()
    let players = client.store.getPlayers()
    let sessionplayer = client.store.getClientPlayer(client.socket.serverclientid)
    let boardcards = sessionplayer.childByName('board')._children()
    let handcards = sessionplayer.childByName('hand')._children()
    let currentplayer = client.store.getCurrentPlayer()

    return (
        <React.Fragment>
            <div style={{display:"flex",flexDirection:"column", minHeight:"100vh", justifyContent:"space-between"}}>
                <div style={{display:"flex", flexGrow: 1 ,alignItems: 'center'}}>
                    <div style={{marginLeft:'40px'}}>
                        roles
                        {/* {players.map(p => <RenderPlayer client={client} onClick={() => {
                            //show board/hand for this player
                        }} key={p.id} player={p} />)} */}
                    </div>
                    <div style={{flexGrow:1,display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:"center"}}>
                        money,draw,pass,special

                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            client.input.emit('specialability',null)
                        }}>special</div>

                        <div style={{cursor:'pointer', border:'1px solid white', margin:'40px', padding:'10px'}} onClick={() => {
                            client.input.emit('pass',null)
                        }}>pass</div>
                    </div>
                </div>
                {/* <div style={{display:"flex", justifyContent:"center", flexWrap:"wrap", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {boardcards.map((c:Card) => <CardView onClick={() => {
                        
                    }} key={c.id} card={c} />)}
                </div> */}
                {/* <div style={{display:"flex", justifyContent:"center", flexWrap:"wrap", overflow:"auto", margin:"20px", border:"1px solid white"}}>
                    {handcards.map((c:Card) => <CardView onClick={() => {
                        client.input.emit('playcard',{id:c.id})
                    }} key={c.id} card={c} />)}
                </div> */}
            </div>
            <Modal visible={sessionplayer.isDiscovering}>
                <div style={{padding:"20px", display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                    {sessionplayer.discoverOptions.map((option,i) => {
                        return <div key={i}>
                            {option.description}
                            {option.value}
                            <img key={i} width="180px" style={{cursor:"pointer", margin:"20px"}} src={`/resources/${option.image}`}  onClick={() => {
                                client.input.emit('completediscovery',{data:option,id:sessionplayer.discoverid})
                            }}></img>
                        </div>
                    })}
                </div>
            </Modal>
        </React.Fragment>
    )
}