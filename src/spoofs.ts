import { EventQueue } from "./libs/event/eventqueue"
import { EventSystem, GenericEvent } from "./libs/event/eventsystem"
import { Store } from './libs/utils/store'
import { to } from "./libs/utils/utils"

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
            let longdcedclients = this.clients.list().filter(c => to(c.dctimestamp, Date.now()) > 5000)
            for(let client of longdcedclients){
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


    connect(socket:IServersideSocket){

        this.sockets.add(socket)

        

        

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
            this.specials.emit('clientconnected',serverclient)
            socket.output.emit('confirmhandshake',{clientid:serverclient.id, socketid:socket.id})
            // this.updateClients()

            //stop bubbling event/consume event
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


export interface IClientSocket{
    input:GenericEvent
    output:GenericEvent
    specials:GenericEvent
    id
    serverclientid

    connect(serverorurl: SocketServer)
}

export class ClientSocket implements IClientSocket{


    id
    input = new GenericEvent()
    output = new GenericEvent()
    specials = new GenericEvent()

    serverclientid: any

    // on(type: any, cb: any) {
    //     this.input.on(type,cb)
    // }
    // emit(type: any, data: any) {
    //     this.output.emit(type,data)
    // }
    
    connect(serverorurl: SocketServer) {
        let serversocket = new SpoofServersideSocket()
        //handshake

        this.input.onany((data,type) => {
            serversocket.input.emit(type,data)
        })

        serversocket.output.onany((message,type) => {
            this.output.emit(type,message)
        })

        this.specials.on('connect',() => {
            console.log('connected')
            let clientid = parseInt(sessionStorage.getItem('clientid'))
            clientid = isNaN(clientid) ? null : clientid
            this.input.emit('handshake', {clientid})
        })

        this.output.on('confirmhandshake',({ clientid,  socketid }) => {
            sessionStorage.setItem('clientid',clientid)
            this.serverclientid = clientid
            this.id = socketid
            this.specials.emit('confirmhandshake',{})
        })

        this.specials.on('disconnect',() => {
            console.log('disconnected');
        })

        

        serverorurl.connect(serversocket)

        

        this.specials.emit('connect',{})

        
    }
}

