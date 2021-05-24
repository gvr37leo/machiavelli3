import { GameManager } from './client/gamemanager'
import React from 'react'
import ReactDOM from 'react-dom'
import {Client} from './client'
import {MainApp} from './client/tsx/mainapp'
import { ClientSocket, SocketServer, SpoofServersideSocket } from './spoofs'


//client -> clientsocket -> serversocket -> server -> gamemanager
//serverside
var socketserver = new SocketServer()
var gamemanager = new GameManager()
gamemanager.setupListeners()
gamemanager.input.addAndTrigger('init',{})

hookupserverandgame()
function hookupserverandgame(){
    //only usefull for broadcasts
    socketserver.input.onany((data,type) => {
        gamemanager.input.addAndTrigger(type,data)
    })

    gamemanager.output.onany((data,type) => {
        socketserver.output.emit(type,data)
    })
}

//clientside
var client = new Client()
client.connect(socketserver)

client.socket.input.emit('playerjoin', { name:'aba' })

// var appel = document.querySelector('#app');
// renderHTML()


// function renderHTML(){
//     // ReactDOM.render(client.root, appel)
//     // ReactDOM.render(<MainApp client={client}></MainApp>, appel)
// }


// gamemanager.input.addAndTrigger('gamestart',{})
// client.updateHtml()


















