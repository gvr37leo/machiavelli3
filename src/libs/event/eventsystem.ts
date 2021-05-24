export class EventSystem<T>{
    idcounter = 0
    listeners:{id:number, cb: (data: any) => void; }[] = []

    listen(cb:(val:T) => void){
        var listener = {
            id:this.idcounter++,
            cb:cb,
        }
        this.listeners.push(listener)
        return listener.id
    }

    unlisten(id){
        var index = this.listeners.findIndex(o => o.id == id)
        this.listeners.splice(index,1)
    }

    trigger(val:T){
        for (var listener of this.listeners) {
            listener.cb(val)
        }
    }
}

export class GenericEvent{

    idcounter = 0
    listeners:{id:number,type:string, cb: (data: any,type:string) => void; }[] = []

    on(type,cb: (data: any,type:string) => void){
        var id = this.idcounter++
        this.listeners.push({id,cb,type})
        return id
    }

    emit(type,data){
        this.listeners.filter(l => l.type == type || l.type == 'any').forEach(l => l.cb(data,type))
    }

    onany(cb: (data: any,type:string) => void){
        this.on('any',cb)
    }
}