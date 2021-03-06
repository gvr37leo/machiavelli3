import { Socket } from "socket.io"
import { EventQueue } from "../shared/event/eventqueue.js"
import { EventSystem, GenericEvent } from "../shared/event/eventsystem.js"
import { Store } from '../shared/utils/store.js'
import { to } from "../shared/utils/utils.js"

export class ServerClient{

    input = new GenericEvent()
    output = new GenericEvent()
    specials = new GenericEvent()
    id//sessionid
    //has multiple sockets below

    //public
    isSynced//set by user
    versionnumber//set by user
    disconnected = false
    dctimestamp = 0

    constructor(){
        
    }
}

export class SocketServer{

    input = new GenericEvent()
    output = new GenericEvent()
    specials = new GenericEvent()

    clients:Store<ServerClient> = new Store()
    sockets:Store<IServersideSocket> = new Store()

    constructor(){
        //todo interval for long disconnected clients
        //emit event for deleted clients so listeners can delete connected players and stuff

        setInterval(() => {
            let longdcedclients = this.clients.list().filter(c => c.disconnected == true && to(c.dctimestamp, Date.now()) > 5000)
            for(let client of longdcedclients){
                console.log('removed client')
                this.clients.remove(client.id)
                this.specials.emit('clientremoved',client)
            }
        }, 6000);

        // this.input.onany((data,type) => {
        //     //goes to game/consumer
        // })

        this.output.onany((data,type) => {
            this.clients.list().forEach((sc) => sc.output.emit(type,data))
        })
    }


    connect(socket:Socket){

        this.sockets.add(socket)

        
        socket.on('message',() => {

        })
        

        socket.input.on('handshake', (data) => {
            let clientid = data.clientid
            if(clientid == null){
                clientid = this.clients.counter
            }
            let serverclient = this.clients.get(clientid)
            if(serverclient == null){
                serverclient = new ServerClient()//serverclients emits should spread and servlients should collect socket emits
                this.clients.add(serverclient)//dit gaat fout id wordt niet op sessionid gezet todo
                serverclient.output.onany((data,type) => {
                    this.sockets.list().filter(s => s.clientid == serverclient.id).forEach(socket => socket.output.emit(type,data))
                })

                serverclient.input.onany((data,type) => {
                    this.input.emit(type,data)
                })
            }
            socket.clientid = serverclient.id
            serverclient.disconnected = false
            console.log(`user connected:${serverclient.id}`)
            socket.output.emit('confirmhandshake',{clientid:serverclient.id, socketid:socket.id})
            this.specials.emit('clientconnected',serverclient)

            //updating clients is done by consumer
        })

        socket.specials.on('disconnect',() => {
            //watch out for multiple connected clients
            // this.clients.remove(client.id)
            
            this.sockets.remove(socket.id)
            let client = this.clients.list().find(c => c.id == socket.clientid)
            let siblingSockets = this.sockets.list().filter(s => s.clientid == client.id)
            if(siblingSockets.length == 0){
                client.disconnected = true
                client.dctimestamp = Date.now()

                console.log(`user disconnected:${client.id}`)
                client.specials.emit('disconnect', {clientid:client.id, socketid:socket.id})
                //client removal is done at 5 second interval
                
                //consumer should updateClients()

                
            }
        })

        socket.input.onany((data,type) => {
            data.socketid = socket.id
            let serverclient = this.clients.get(socket.clientid)
            data.clientid = serverclient.id
            serverclient.input.emit(type,data)
        })
    }

    
}

interface IServersideSocket{
    id
    clientid
    input:GenericEvent
    output:GenericEvent
    specials:GenericEvent


}

export class SpoofServersideSocket implements IServersideSocket{
    id: any
    clientid: any
    input = new GenericEvent()
    output = new GenericEvent()
    specials = new GenericEvent()
}


// ----------------------------------------------------------------------   CLIENT   -------------------------------------------------------------------------------




