
import {EventSystem} from './eventsystem.js'
import {first} from '../utils/utils.js'

export class EventQueue{
    idcounter = 0
    listeners
    events
    onProcessFinished = new EventSystem()
    onRuleBroken = new EventSystem()
    rules = []
    discoveryidcounter = 0

    constructor(){
        this.listeners = []
        this.events = []
    }

    // listenDiscovery(type:string,megacb:(data:any,cb:(cbdata:any) => void) => void){
    //     this.listen(type,(dataAndCb:{data:any,cb:(ads:any) => void}) => {
    //         megacb(dataAndCb.data,dataAndCb.cb)
    //     })
    // }

    // startDiscovery(type:string,data: any, cb: (cbdata: any) => void) {
    //     this.addAndTrigger(type,{data,cb})
    // }

    listenDiscovery(type, cb) {
        this.listen(type,(discovery) => {
            cb(discovery.data,discovery.id)
        })
    }


    
    startDiscovery(type, data, cb) {
        let createdid = this.discoveryidcounter++
        
        let listenerid = this.listen('completediscovery',(discovery) => {
            if(discovery.data.id == createdid){
                this.unlisten(listenerid)
                cb(discovery.data.data)
            }
        })
        this.addAndTrigger(type,{data,id: createdid})
    }

    completeDiscovery(data, id) {
        this.addAndTrigger('completediscovery',{data,id})
    }


    listen(type,cb){
        let id = this.idcounter++
        this.listeners.push({
            id:id,
            type: type,
            cb,
        })
        return id
    }

    listenOnce(type,cb){
        let id = this.listen(type,(data) => {
            this.unlisten(id)
            cb(data)
        })
        return id
    }

    unlisten(id){
        let index = this.listeners.findIndex(o => o.id == id)
        this.listeners.splice(index,1)
    }

    process(){
        
        while(this.events.length > 0){
            let currentEvent = this.events.shift()
            let listeners = this.listeners.filter(l => l.type == currentEvent.type)
            
            let brokenrules = this.rules.filter(r => r.type == currentEvent.type && r.rulecb(currentEvent.data) == false)
            
            if(brokenrules.length == 0){
                for(let listener of listeners){
                    listener.cb(currentEvent.data)
                }
            }else{
                console.log(first(brokenrules).error)
                this.onRuleBroken.trigger({event:currentEvent,error:first(brokenrules).error})
            }
        }
        this.onProcessFinished.trigger(0)
    }
    
    add(type,data){
        this.events.push({
            type: type,
            data:data,
        })
    }

    addAndTrigger(type,data){
        this.add(type,data)
        this.process()
    }

    addRule(type,error,rulecb){
        this.rules.push({type,error,rulecb})
    }
}