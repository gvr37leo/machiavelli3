import React from "react"
import { Client } from "../../client"
import { GameWonScreen } from "./gamewonscreen"
import { RenderHomepage } from "./homepage"
import { StartScreen } from "./startscreen"


var shown = false

export function MainApp(props:{client:Client}){
    var client = props.client
    var game = props.client.helper.getGame()
    var players = props.client.helper.getPlayers()
    var sessionplayer = props.client.helper.getSessionPlayer(props.client.sessionid)
    var discardpile = props.client.helper.getDiscardPile()
    var deck = props.client.helper.getDeckFolder()


    return (
        <React.Fragment>
            {(() => {
                //check if clientplayer has a name
                if(sessionplayer.name == ''){
                    return <StartScreen client={props.client} />
                }
                if(game.status == 'started'){
                    return <RenderHomepage client={props.client} />
                }
                if(game.status == 'finished'){
                    return <GameWonScreen client={props.client} />
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
                                    props.client.output.trigger({type:'gamestart',data:{}})
                                }}>start new game</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    props.client.output.trigger({type:'debugfinishgame',data:{}})
                                }}>end game</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    props.client.updateHtml()
                                }}>rerender</button>
                            </div>
                            <div style={{marginBottom:"10px"}}>
                                <button onClick={() => {
                                    props.client.output.trigger({type:'requestfullupdate',data:{}})
                                }}>request full update</button>
                            </div>
                            <div>clientid:{props.client.id}</div>
                            <div>sessionid:{props.client.sessionid}</div>
                            <div>dbversion:{props.client.lastprocessedversion}</div>
                        </React.Fragment>
                    }
                })()}
            </div>
        </React.Fragment>
        
    )
}




/*
space elevator
    low mass solid bodies
    can be used in combination with tether to catch fast arriving spacecraft or lauch spacecraft at high speed

space tether
    railed on asteroids
    force = rot^2 * length
    electric tethering
    ion engines
    combustion engines
    tax spaceships for fuel
    returning craft
    
    
    efficiency tricks at cost of availability
    if only payload matters,cargo can be detached from spaceship
    skydrone for meeting up with aircraft
    counterweight
    stepped tether ladder
    rotating
    elliptic orbit(cardiod)
    whip at end
    2 step tether for shorter but faster spinning skyhook








*/