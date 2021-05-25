import {EventSystem, GenericEvent} from './libs/event/eventsystem'
import {EntityStore,Entity} from './libs/utils/store'
import { to } from './libs/utils/utils'
import {MainApp} from './client/tsx/mainapp'
import { EventQueue } from './libs/event/eventqueue'
import { ClientSocket, IClientSocket, SocketServer } from './spoofs'

declare let toastr

export class Client{

    root:JSX.Element
    output = new GenericEvent()
    input = new GenericEvent()
    special = new GenericEvent()
    store:EntityStore = new EntityStore()
    lastprocessedversion = null

    // <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.3/socket.io.js"></script>
    socket: IClientSocket//socket.io socket


    constructor(){
        this.output.on('deltaupdate',(data) => {
            //check version number
            this.store.applyChanges(data.deletions,data.upserts)
            if(to(this.lastprocessedversion,data.version) >= 2){
                this.output.emit('requestfullupdate',{})
                console.log(`request full update ${this.lastprocessedversion} -> ${data.version}`)
            }
            this.lastprocessedversion = data.version
            this.updateHtml()
        })

        this.output.on('update',(data) => {
            this.lastprocessedversion = data.version
            this.store = this.deserialize(data.data)
            this.updateHtml()
        })

        this.output.on('turnstart',(data) => {
            let selfplayer = this.store.getClientPlayer(this.socket.serverclientid)
            if(selfplayer.id == data){
                navigator.vibrate(500)
                toastr.success('your turn')
            }
        })

        this.output.on('error',(data) => {
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

        // this.socket.specials.on('confirmhandshake',() => {
        //     this.clientid = this.socket.serverclientid
        //     this.socketid = this.socket.id
        // })

        this.socket.connect(socketserver)
    }


    updateHtml(){
        this.root = MainApp({client:this})
        this.special.emit('updatehtml',null)
    }

    deserialize(data:any[]){
        let entities = data
        let store = new EntityStore()
        
        for(let entity of entities){
            entity.__proto__ = Entity.prototype
            entity.store
            store.inject(entity)
        }

        return store
    }
}
