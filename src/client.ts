import {EventSystem, GenericEvent} from './libs/event/eventsystem'
import {EntityStore,Entity} from './libs/utils/store'
import { to } from './libs/utils/utils'
import {MainApp} from './client/tsx/mainapp'
import { EventQueue } from './libs/event/eventqueue'
import { ClientSocket, IClientSocket, SocketServer } from './spoofs'

declare var toastr

export class Client{

    root:JSX.Element
    output = new GenericEvent()
    input = new GenericEvent()
    store:EntityStore = new EntityStore()
    socketid = null
    clientid = null
    lastprocessedversion = null

    // <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.3/socket.io.js"></script>
    socket: IClientSocket//socket.io socket


    constructor(){
        this.input.on('deltaupdate',(data) => {
            //check version number
            console.log('delta update')
            this.store.applyChanges(data.deletions,data.upserts)
            if(to(this.lastprocessedversion,data.version) >= 2){
                this.output.emit('requestfullupdate',{})
                console.log(`request full update ${this.lastprocessedversion} -> ${data.version}`)
            }
            this.lastprocessedversion = data.version
            this.updateHtml()
        })

        this.input.on('update',(data) => {
            console.log('full update')
            this.lastprocessedversion = data.version
            this.store = this.deserialize(data.data)
            this.updateHtml()
        })

        this.input.on('turnstart',(data) => {
            var selfplayer = this.store.getClientPlayer(this.socketid)
            if(selfplayer.id == data){
                navigator.vibrate(500)
                toastr.success('your turn')
            }
        })

        this.input.on('error',(data) => {
            toastr.error(data)
        })

    }

    //connect client with clientsocket and then clientsocket to server/serversocket
    connect(socketserver:SocketServer){
        this.socket = new ClientSocket()
        this.input.onany((data,type) => {
            this.socket.input.emit(type,data)
        })
        
        this.socket.output.onany((data,type) => {
            this.output.emit(type,data)
        })

        this.socket.connect(socketserver)
    }


    updateHtml(){
        // this.root = MainApp({client:this})
        // renderHTML()
    }

    deserialize(data:any[]){
        var entities = data
        var store = new EntityStore()
        
        for(var entity of entities){
            entity.__proto__ = Entity.prototype
            entity.store
            store.insert(entity,null)
        }

        return store
    }
}
