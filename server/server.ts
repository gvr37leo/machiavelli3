//startup socketserver
//startup game
//connect server with game


import {SocketServer} from './spoofs.js'
import {GameManager} from './gamemanager.js'
import express from 'express'
import {Server} from 'http'
import {Server as IOServer} from 'socket.io'

var gamemanager = new GameManager()
var socketserver = new SocketServer()


console.log('hello')
const app = express();
const http = new Server(app);
const io = new IOServer(http);
var port = process.env.PORT || 8000

app.use(express.static('../'))

// let socketserver = new SocketServer()
// let gamemanager = new GameManager()
// gamemanager.setupListeners()
// gamemanager.input.addAndTrigger('init',{})

// hookupserverandgame()
// function hookupserverandgame(){
//     //only usefull for broadcasts

//     //todo game should listen to connecting and disconnecting clients
//     //todo game should emit updates
//     socketserver.input.onany((data,type) => {
//         gamemanager.input.addAndTrigger(type,data)
//     })

//     gamemanager.output.onany((data,type) => {
//         socketserver.output.emit(type,data)
//     })

//     gamemanager.input.onProcessFinished.listen(() => {
//         updateClients()
//     })

//     socketserver.specials.on('clientconnected',(client:ServerClient) => {
//         let playerfolder = gamemanager.store.getGame().childByName('playerfolder')
//         let player = gamemanager.store.add(new Player({
//             clientid:client.id,
//         }),playerfolder)
//         gamemanager.store.add(new Entity({name:'hand'}),player)
//         gamemanager.store.add(new Entity({name:'board'}),player)
//         // updateClients()
//     })

//     socketserver.specials.on('disconnect',() => {
//         // updateClients()
//     })

//     socketserver.specials.on('clientremoved',() => {
//         //todo delete associated player
//         // updateClients()
//     })

//     function updateClients(){
//         for(let client of socketserver.clients.list()){
            
//             if(client.isSynced){
                
//                 let changes = gamemanager.store.collectChanges()
//                 if(changes.deletions.length > 0 || changes.upserts.length > 0){
//                     console.log('deltaupdate')
//                     client.output.emit('deltaupdate',changes)
//                 }
//             }else{
//                 console.log('fullupdate')
//                 client.isSynced = true
//                 let fulldb = gamemanager.store.list()
//                 client.output.emit('update',gamemanager.store.collectChanges())
//             }
//         }
//     }
// }






io.on('connection', (socket) => {
    
    socketserver.connect(socket)

    console.log('socket connection')
    // server.onBroadcast.listen((message) => {
    //     io.emit('message',message)
    // })
    // var client = new ServerClient(socket,idcounter++)
    // server.connect(client)

    socket.on('disconnect', () => {
        console.log('socket disconnect')
    })
})

http.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})