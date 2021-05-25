import { GameManager } from './client/gamemanager'
import React from 'react'
import ReactDOM from 'react-dom'
import {Client} from './client'
import {MainApp} from './client/tsx/mainapp'
import { ClientSocket, ServerClient, SocketServer, SpoofServersideSocket } from './spoofs'
import { Player } from './client/models'
import { Entity } from './libs/utils/store'


//client -> clientsocket -> serversocket -> server -> gamemanager
//serverside
let socketserver = new SocketServer()
let gamemanager = new GameManager()
gamemanager.setupListeners()
gamemanager.input.addAndTrigger('init',{})

hookupserverandgame()
function hookupserverandgame(){
    //only usefull for broadcasts

    //todo game should listen to connecting and disconnecting clients
    //todo game should emit updates
    socketserver.input.onany((data,type) => {
        gamemanager.input.addAndTrigger(type,data)
    })

    gamemanager.output.onany((data,type) => {
        socketserver.output.emit(type,data)
    })

    gamemanager.input.onProcessFinished.listen(() => {
        updateClients()
    })

    socketserver.specials.on('clientconnected',(client:ServerClient) => {
        let playerfolder = gamemanager.store.getGame().childByName('playerfolder')
        let player = gamemanager.store.add(new Player({
            clientid:client.id,
        }),playerfolder)
        gamemanager.store.add(new Entity({name:'hand'}),player)
        gamemanager.store.add(new Entity({name:'board'}),player)
        //add player
    })

    socketserver.specials.on('disconnect',() => {
        //updateclients/status
    })

    socketserver.specials.on('clientremoved',() => {
        //remove player
    })

    function updateClients(){
        for(let client of socketserver.clients.list()){
            if(client.isSynced){
                let changes = gamemanager.store.collectChanges()
                if(changes.deletions.length > 0 || changes.upserts.length > 0){
                    client.output.emit('deltaupdate',changes)
                }
            }else{
                client.isSynced = true
                let fulldb = gamemanager.store.list()
                client.output.emit('update',{
                    version:gamemanager.store.versionnumber,
                    data:fulldb
                })
            }
        }
    }
}



//clientside
let client = new Client()
client.connect(socketserver)

client.socket.input.emit('playerjoin', { name:'aba' })
// gamemanager.input.addAndTrigger('gamestart',{})
let appel = document.querySelector('#app');
ReactDOM.render(client.root,appel)
client.special.on('updatehtml',() => {
    ReactDOM.render(client.root,appel)
})



// client.updateHtml()


















