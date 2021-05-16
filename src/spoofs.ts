import { EventQueue } from "./libs/event/eventqueue"
import { EventSystem } from "./libs/event/eventsystem"
import { Store } from './libs/utils/store'
import { to } from "./libs/utils/utils"

export class ServerClient{

    input
    output
    id//sessionid
    //has multiple sockets below

    //public
    isSynced//set by user
    versionnumber//set by user
    disconnected
    dctimestamp

    constructor(){
        
    }
}

export class SocketServer{

    input = new EventSystem<{type:string,data:any}>()
    output = new EventSystem<{type:string,data:any}>()

    clients:Store<ServerClient>
    sockets:Store<IServersideSocket>

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
            client.input.trigger('finishhandshake',{clientid:client.id, socketid:socket.id})
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

                client.input.trigger('disconnect',{clientid:client.id, socketid:socket.id})
                console.log(`user disconnected:${client.id}`)
                //set disconnected to true, set dctimestamp to Date.now(),and flag it
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
    input: EventSystem<any>
    output: EventQueue

}



interface IClientSocket{
    input
    output
    sessionid

    connect(serverorurl)
    
}

export class ClientSocket implements IClientSocket{


    input: any
    output: any
    sessionid: any

    
    
    connect(serverorurl: SocketServer) {
        var socket = new SpoofServersideSocket()
        serverorurl.connect(socket)
    }

}

