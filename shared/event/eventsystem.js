export class EventSystem{
    idcounter = 0
    listeners = []

    listen(cb){
        let listener = {
            id:this.idcounter++,
            cb:cb,
        }
        this.listeners.push(listener)
        return listener.id
    }

    unlisten(id){
        let index = this.listeners.findIndex(o => o.id == id)
        this.listeners.splice(index,1)
    }

    trigger(val){
        for (let listener of this.listeners) {
            listener.cb(val)
        }
    }
}

export class GenericEvent{

    idcounter = 0
    listeners = []

    on(type,cb){
        let id = this.idcounter++
        this.listeners.push({id,cb,type})
        return id
    }

    emit(type,data){
        this.listeners.filter(l => l.type == type || l.type == 'any').forEach(l => l.cb(data,type))
    }

    onany(cb){
        this.on('any',cb)
    }
}