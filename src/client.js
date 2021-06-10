import {EventSystem, GenericEvent} from '../shared/event/eventsystem.js'
import {EntityStore,Entity} from '../shared/utils/store.js'
import { to } from '../shared/utils/utils.js'
import {MainApp} from './client/mainapp.js'
import { EventQueue } from '../shared/event/eventqueue.js'


export class Client{

    root
    output = new GenericEvent()
    input = new GenericEvent()
    special = new GenericEvent()
    store = new EntityStore()
    lastprocessedversion = 0

    // <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.3/socket.io.js"></script>
    socket//socket.io socket


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
            this.store = this.deserialize(data.upserts)
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
    connect(){

    }


    updateHtml(){
        this.root = MainApp({client:this})
        this.special.emit('updatehtml',null)
    }

    deserialize(data){
        let entities = data
        let store = new EntityStore()
        
        for(let entity of entities){
            entity.__proto__ = Entity.prototype
            store.inject(entity)
        }

        return store
    }
}
