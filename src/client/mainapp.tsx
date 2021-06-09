import React from "react"
import { Client } from "../client"
import { GameWonScreen } from "./gamewonscreen"
import { RenderHomepage } from "./homepage"
import { StartScreen } from "./startscreen"


let shown = false

export function MainApp({client}:{client:Client}){
    let game = client.store.getGame()
    let players = client.store.getPlayers()
    let sessionplayer = client.store.getClientPlayer(client.socket.serverclientid)
    let discardpile = client.store.getDiscardPile()
    let deck = client.store.getDeckFolder()


    return (
        <React.Fragment>
            {(() => {
                
                if(sessionplayer.name == ''){
                    return <StartScreen client={client} />
                }
                if(game.status == 'init'){
                    return <div>game waiting to start</div>
                }
                if(game.status == 'started'){
                    return <RenderHomepage client={client} />
                }
                if(game.status == 'finished'){
                    return <GameWonScreen client={client} />
                }
                
            })()} 
            <div style={{position:"absolute", border:"1px solid black", borderRadius:"3px", color:"black", top:"10px", left:"10px", padding:"20px", background:"white"}}>
                <div>debug panel</div>
                <div style={{marginBottom:"10px"}}>
                    <button onClick={() => {
                        shown = !shown
                        client.updateHtml()
                    }}>{shown ? "hide" : "show"}</button>
                </div>

                {(() => {
                    if(shown){
                        return <React.Fragment>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    client.input.emit('gamestart',{})
                                }}>start new game</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    client.input.emit('debugfinishgame',{})
                                }}>end game</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    client.updateHtml()
                                }}>rerender</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    client.input.emit('requestfullupdate',{})
                                }}>request full update</button>
                            </div>
                            <div>socketid:{client.socket.id}</div>
                            <div>clientid:{client.socket.serverclientid}</div>
                            <div>dbversion:{client.lastprocessedversion}</div>
                        </React.Fragment>
                    }
                })()}
            </div>
        </React.Fragment>
        
    )
}
