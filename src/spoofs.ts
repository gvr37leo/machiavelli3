import { EventQueue } from "./libs/event/eventqueue"
import { EventSystem } from "./libs/event/eventsystem"
import { Store } from './libs/utils/store'
import { to } from "./libs/utils/utils"

export class ServerClient{

    input = new EventSystem()
    output = new EventSystem()
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

    input = new EventSystem<{type:string,data:any}>()
    output = new EventSystem<{type:string,data:any}>()

    clients:Store<ServerClient> = new Store()
    sockets:Store<IServersideSocket> = new Store()

    constructor(){
        //todo interval for long disconnected clients
        //emit event for deleted clients so listeners can delete connected players and stuff

        setInterval(() => {
            var longdcedclients = this.clients.list().filter(c => to(c.dctimestamp, Date.now()) > 5000)
            for(var client of longdcedclients){
                this.clients.remove(client.id)
                this.output.trigger({type:'clientremoved',data:client})
            }
        }, 6000);
    }


    connect(socket:IServersideSocket){

        this.sockets.add(socket)
        

        socket.output.listen('handshake', (data) => {
            let clientid = data.clientid
            if(clientid == null){
                clientid = this.clients.counter
            }
            let client = this.clients.get(clientid)
            socket.clientid = client.id
            if(client == null){
                client = new ServerClient()
                this.clients.add(client)//dit gaat fout id wordt niet op sessionid gezet todo
            }

            client.disconnected = false
            console.log(`user connected:${client.id}`)
            this.output.trigger({type:'clientconnected',data:client})
            client.input.trigger({type:'finishhandshake',clientid:client.id, socketid:socket.id})
            // this.updateClients()
        })

        socket.output.listen('disconnect',() => {
            //watch out for multiple connected clients
            // this.clients.remove(client.id)
            
            this.sockets.remove(socket.id)
            let client = this.clients.list().find(c => c.id == socket.clientid)
            let siblingSockets = this.sockets.list().filter(s => s.clientid == client.id)
            if(siblingSockets.length == 0){
                client.disconnected = true
                client.dctimestamp = Date.now()

                console.log(`user disconnected:${client.id}`)
                client.input.trigger({type:'disconnect', clientid:client.id, socketid:socket.id})
                // this.updateClients()

                
            }
        })
    }

    
}

interface IServersideSocket{
    id
    clientid
    input:EventSystem<any>
    output:EventQueue

}

export class SpoofServersideSocket implements IServersideSocket{
    id: any
    clientid: any
    input = new EventSystem<any>()
    output = new EventQueue()

}



interface IClientSocket{
    input
    output
    sessionid

    connect(serverorurl)
    
}

export class ClientSocket implements IClientSocket{


    input = new EventSystem<any>()
    output = new EventSystem<any>()
    sessionid: any

    
    
    connect(serverorurl: SocketServer) {
        var socket = new SpoofServersideSocket()
        serverorurl.connect(socket)
    }

}

