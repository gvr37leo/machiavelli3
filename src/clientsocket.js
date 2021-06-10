
export class ClientSocket{


    id = -1
    input = new GenericEvent()
    output = new GenericEvent()
    specials = new GenericEvent()

    serverclientid = -1
    localdebug = true

    // on(type: any, cb: any) {
    //     this.input.on(type,cb)
    // }
    // emit(type: any, data: any) {
    //     this.output.emit(type,data)
    // }
    
    connect(socket) {
        socket.open()
        //handshake

        this.input.onany((data,type) => {
            serversocket.input.emit(type,data)
        })

        serversocket.output.onany((message,type) => {
            this.output.emit(type,message)
        })

        socket.on('connect',() => {
            console.log('connected')
            //todo dit gaat fout op lokaal testen
            let clientid = parseInt(sessionStorage.getItem('clientid'))
            if(this.localdebug){
                clientid = null
            }

            clientid = isNaN(clientid) ? null : clientid
            this.input.emit('handshake', {clientid})
        })

        this.output.on('confirmhandshake',({ clientid,  socketid }) => {
            sessionStorage.setItem('clientid',clientid)
            this.serverclientid = clientid
            this.id = socketid
            this.specials.emit('confirmhandshake',{})
        })

        this.specials.on('disconnect',() => {
            console.log('disconnected');
        })

        

        serverorurl.connect(serversocket)

        

        this.specials.emit('connect',{})

        
    }
}
