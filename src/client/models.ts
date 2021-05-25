import {Entity} from '../libs/utils/store'

export class Game extends Entity{
    

    crownwearerid = 0
    murderedRoleid = 0
    burgledRoleid = 0
    firstFinishedPlayer = 0
    kingshownRole = 0
    roleturnid = 0
    status = 'init'
    winnerid = 0

    constructor(init?:Partial<Game>){
        super()
        Object.assign(this,init)
        this.type = 'game'
    }
}

export class Role extends Entity{
    id:number
    player:number
    color
    image
    specialUsed:boolean

    constructor(init?:Partial<Role>){
        super()
        Object.assign(this,init)
        this.type = 'role'
    }
}


export class DiscoverOption{
    image
    description
    value

    constructor(init?:Partial<DiscoverOption>){
        Object.assign(this,init)
    }
}

export class Player extends Entity{
    id:number
    hand:number[]
    buildings:number[]
    money:number
    score:number
    buildactions:number
    specialUsed:boolean
    isDiscovering:boolean
    discoverOptions:DiscoverOption[]
    discoverid
    discovermin: number
    discovermax: number
    
    clientid
    socketid
    disconnected = false
    dctimestamp = 0

    

    constructor(init?:Partial<Player>){
        super()
        Object.assign(this,init)
        this.type = 'player'
    }
}

export class Card extends Entity{
    id:number
    points
    isAction
    isAnyRole

    role
    cost
    image

    constructor(init?:Partial<Card>){
        super()
        Object.assign(this,init)
        this.type = 'card'
    }
}