import React from 'react'
import { Client } from "../client"

export function StartScreen(props){
    return <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}} >
        <div>
            <input placeholder="Name" id="name" style={{marginRight:"20px", padding:"10px"}}/>
            <button style={{padding:"10px 20px"}} onClick={() => {
                let name = (document.querySelector('#name')).value
                props.client.input.emit('playerjoin',{name:name})
            }}>join</button>
        </div>
    </div>
}