import {EventSystem} from './libs/event/eventsystem'
import {EntityStore,Entity} from './libs/utils/store'
import { to } from './libs/utils/utils'
import {MainApp} from './client/tsx/mainapp'
import { EventQueue } from './libs/event/eventqueue'

declare var toastr

export class Client{

    root:JSX.Element
    output = new EventSystem<{type,data}>()
    input = new EventQueue()
    store:EntityStore
    id = null
    sessionid = null
    lastprocessedversion = null

    // <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.3/socket.io.js"></script>
    socket: any//socket.io socket


    constructor(){
        this.input.listen('deltaupdate',(data) => {
            //check version number
            console.log('delta update')
            this.store.applyChanges(data.deletions,data.upserts)
            if(to(this.lastprocessedversion,data.version) >= 2){
                this.output.trigger({type:'requestfullupdate',data:{}})
                console.log(`request full update ${this.lastprocessedversion} -> ${data.version}`)
            }
            this.lastprocessedversion = data.version
            this.updateHtml()
        })

        this.input.listen('update',(data) => {
            console.log('full update')
            this.lastprocessedversion = data.version
            this.store = this.deserialize(data.data)
            this.updateHtml()
        })

        this.input.listen('turnstart',(data) => {
            var selfplayer = this.store.getClientPlayer(this.id)
            if(selfplayer.id == data){
                navigator.vibrate(500)
                toastr.success('your turn')
            }
        })

        this.input.listen('error',(data) => {
            toastr.error(data)
        })

    }

    // connectSocket(socket){
    //     this.socket = socket

    //     this.output.listen((val) => {
    //         socket.emit('message',val)
    //     })
    //     socket.on('message',(message) => {
    //         this.input(message.type,message.data)
    //     })

    //     socket.on('connect',() => {
    //         console.log('connected')
    //         socket.emit('handshake',{sessionid:parseInt(sessionStorage.getItem('sessionid'))},({ sessionid, clientid }) => {
    //             sessionStorage.setItem('sessionid',sessionid)
    //             this.sessionid = sessionid
    //             this.id = clientid
    //         })
    //     })

    //     socket.on('disconnect',() => {
    //         console.log('disconnected');
    //     })

    //     socket.open()

    // }

    connectSpoofSocket(socket){
        
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
