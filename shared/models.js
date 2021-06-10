import {Entity} from './utils/store.js'

export class Action{
    
    constructor(type){

    }
}

export class Game extends Entity{
    

    crownwearerid = 0
    murderedRoleid = 0
    burgledRoleid = 0
    firstFinishedPlayer = 0
    roleturnindex = 0
    status = 'init'
    winnerid = 0

    rolestopick = []
    opendiscardedroles = []
    closeddiscardedroles = []
    pickingplayerindex = 0
    kingshownRole = 0
    actions
    actionindex = 0

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'game'
    }
}

export class Role extends Entity{
    id
    player
    color
    image
    specialUsed = false
    incomephaseTaken = false

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'role'
    }
}


export class DiscoverOption{
    image
    description
    value

    constructor(init){
        Object.assign(this,init)
    }
}

export class Player extends Entity{
    id
    hand = []
    buildings = []
    money
    score
    buildactions
    specialUsed
    isDiscovering
    discoverOptions = []
    discoverid
    discovermin
    discovermax
    
    clientid
    socketid
    disconnected = false
    dctimestamp = 0

    

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'player'
    }
}

export class Card extends Entity{
    id
    points
    isAction
    isAnyRole

    role
    cost
    image

    constructor(init){
        super()
        Object.assign(this,init)
        this.type = 'card'
    }
}