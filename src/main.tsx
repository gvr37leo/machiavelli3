import { GameManager } from './client/gamemanager'
import React from 'react'
import ReactDOM from 'react-dom'
import {Client} from './client'
import {MainApp} from './client/tsx/mainapp'
import { ClientSocket, SocketServer, SpoofServersideSocket } from './spoofs'

var client = new Client()
var clientsocket = new ClientSocket()
var socketserver = new SocketServer()
var gamemanager = new GameManager()

//client -> clientsocket -> serversocket -> server -> gamemanager

function hookupClientAndServer(){

    clientsocket.connect(socketserver)
    client.output.listen((message:{type,client,data}) => {
        clientsocket.input.trigger(message)
    })

    clientsocket.output.listen((message:{type,data}) => {
        client.input.addAndTrigger(message.type,message.data)
    })
}

function hookupserverandgame(){
    socketserver.output.listen((message:{type,client,data}) => {

        //client connect
        //client disconnect
        //
        gamemanager.input.addAndTrigger(message.type,message)
    })

    gamemanager.output.listen((message:{type,data}) => {
        socketserver.input.trigger(message)
    })
}

hookupClientAndServer()
hookupserverandgame()






gamemanager.input.addAndTrigger('init',{})
gamemanager.input.addAndTrigger('playerjoin',{name:'aba'})
gamemanager.input.addAndTrigger('playerjoin',{name:'bob'})
gamemanager.input.addAndTrigger('playerjoin',{name:'cas'})
gamemanager.input.addAndTrigger('playerjoin',{name:'don'})
gamemanager.input.addAndTrigger('gamestart',{})
client.updateHtml()




var appel = document.querySelector('#app');
renderHTML()


function renderHTML(){
    // ReactDOM.render(client.root, appel)
    ReactDOM.render(<MainApp client={client}></MainApp>, appel)
}
