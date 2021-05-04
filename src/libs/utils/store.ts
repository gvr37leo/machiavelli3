import {EventQueue} from '../event/eventqueue'
import { remove } from './utils'

export class EntityStore{

    map = new Map<number,Entity>()
    counter = 0
    upserts = new Set<number>()
    deletions = new Set<number>()
    versionnumber = 0

    get(id:number){
        return this.map.get(id)
    }

    add(item:Entity,parent:Entity){
        item.id = this.counter++
        return this.insert(item,parent)
    }

    insert(item:Entity,parent:Entity){
        item.store = this
        this.map.set(item.id, item)
        this.move(item, parent)//event trigger happens in move
        this.upserts.add(item.id)
        return item
    }

    list(){
        return Array.from(this.map.values())
    }

    remove(id){
        var ent = this.map.get(id)
        var parent = this.map.get(ent.parent)
        remove(parent.children, ent.id)
        this.map.delete(id)
        this.deletions.add(id)
        parent.onEvent.addAndTrigger('remove',id)
        return ent
    }

    move(ent:Entity, parent:Entity){
        var oldparent = this.get(ent.parent)
        if(oldparent != null){
            remove(oldparent.children,ent.id)
            oldparent.onEvent.addAndTrigger('remove',ent)
            this.flag(oldparent.id)
        }
        if(parent != null){
            ent.parent = parent.id
            parent.children.push(ent.id)
            parent.onEvent.addAndTrigger('add',ent)
            this.flag(parent.id)
        }
    }

    ancestor(ent:Entity,type:string){
        var current = ent
        while(current != null){
            if(current.type == type){
                return current
            }
            current = this.parent(ent)
        }
        return null
    }

    parent(ent:Entity){
        return this.map.get(ent.parent)
    }

    children(ent:Entity){
        return Array.from(ent.children.values()).map(id => this.map.get(id))
    }

    descendants(ent:Entity){
        return this.children(ent).flatMap(ent => this.descendants(ent))
    }

    duplicate(ent:Entity,amount:number):Entity[]{
        var res = []
        for(var i = 0; i < amount;i++){
            var obj = this.add(Object.assign({},ent),ent._parent())    
            res.push(obj)
        }
        return res
    }


    flag(id:number){
        this.upserts.add(id)
    }

    collectChanges(){
        for(var deletion of this.deletions){
            if(this.upserts.has(deletion)){
                this.deletions.delete(deletion)
                this.upserts.delete(deletion)
            }
        }
        var deletions = Array.from(this.deletions.keys())
        var upserts = Array.from(this.upserts.entries()).map(e => this.get(e[0]))
        this.upserts.clear()
        this.deletions.clear()
        if(upserts.length > 0 || deletions.length > 0){
            this.versionnumber++
        }


        //optimization potential: if delete id present in upserts cancel them both out
        return {
            upserts,
            deletions,
            version:this.versionnumber
        }
    }

    applyChanges(deletions:number[],upserts:any[]){
        for(var upsert of upserts){
            var local = this.get(upsert.id)
            if(local == null){
                this.insert(upsert,null)
                upsert.__proto__ = Entity.prototype
            }else{
                Object.assign(local,upsert)
            }
        }

        for(var deletion of deletions){
            this.remove(deletion)
        }
    }
}


export class Entity{
    id:number
    name:string
    parent:number
    type:string
    children:number[] = []
    store:EntityStore

    onEvent:EventQueue = new EventQueue()

    // onCreate
    // onDelete
    // onChange
    // onTick
    // onDraw

    constructor(init?:Partial<Entity>){
        Object.assign(this,init)
        this.type = 'entity'
    }

    ancestor(type:string){
        return this.store.ancestor(this,type)
    }

    _parent(){
        return this.store.parent(this)
    }

    _children(){
        return this.store.children(this)
    }

    descendants(){
        return this.store.descendants(this)
    }

    duplicate(amount){
        return this.store.duplicate(this,amount)
    }

    setParent(parent:Entity){
        this.store.move(this,parent)
    }

    flag(){
        this.store.flag(this.id)
    }

    childByName(name):Entity{
        return this._children().find(c => c.name == name)
    }

    removeChildren(){
        return this.descendants().map(c => this.store.remove(c.id))
    }


}


