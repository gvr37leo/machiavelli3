import {EventQueue} from '../libs/event/eventqueue'
import {EventSystem, GenericEvent} from '../libs/event/eventsystem'
import { Entity, EntityStore } from '../libs/utils/store'
import {RNG, shuffle} from '../libs/utils/utils'
import {genDB, generateCards} from './generateDB'
import { Card, DiscoverOption, Game, Player, Role } from './models'

export class GameManager{

    store = new EntityStore()
    input = new EventQueue()
    output = new GenericEvent()
    
    broadcastEvent = new EventSystem<{type:string,data}>()
    rng = new RNG(Math.floor(Math.random() * 100000))

    constructor(){
        
    }

    setupListeners(){

        this.input.onRuleBroken.listen(e => {
            this.output.emit('error',{sessionid:e.event.data.sessionid,data:e.error})
        })

        this.input.listen('init',() => {
            this.store = new EntityStore()
            let game = this.store.add(new Game({name:'gameroot'}),null)
            let rolesfolder = this.store.add(new Entity({name:'rolesfolder'}),game)
            let playerfolder = this.store.add(new Entity({name:'playerfolder'}),game)
            let deck = this.store.add(new Entity({name:'deck'}),game)
            let discardpile = this.store.add(new Entity({name:'discardpile'}),game)
        
            let moordenaar = this.store.add(new Role({name:'moordenaar',color:'white',image:'/res/moordenaar.png'}),rolesfolder)
            let dief = this.store.add(new Role({name:'dief',color:'white',image:'/res/dief.png'}),rolesfolder)
            let magier = this.store.add(new Role({name:'magier',color:'white',image:'/res/magier.png'}),rolesfolder)
            let koning = this.store.add(new Role({name:'koning',color:'yellow',image:'/res/koning.png'}),rolesfolder)
            let prediker = this.store.add(new Role({name:'prediker',color:'blue',image:'/res/prediker.png'}),rolesfolder)
            let koopman = this.store.add(new Role({name:'koopman',color:'green',image:'/res/koopman.png'}),rolesfolder)
            let bouwmeester = this.store.add(new Role({name:'bouwmeester',color:'white',image:'/res/bouwmeester.png'}),rolesfolder)
            let condotierre = this.store.add(new Role({name:'condotierre',color:'red',image:'/res/condotierre.png'}),rolesfolder)
            // this.input.add('gamestart',null)
        })

        this.input.listen('playerjoin', (e) => {
            let player = this.store.getClientPlayer(e.clientid)
            player.name = e.name
            player.flag()
        })
        
        this.input.listen('gamestart',() => {
            //generate deck
            

            let game = this.store.getGame()
            let deckfolder = this.store.getDeckFolder()
            deckfolder.removeChildren()
            
            let deck = game.childByName('deck')
            let rolesfolder = game.childByName('rolesfolder')
            let koning = rolesfolder.childByName('koning')
            let prediker = rolesfolder.childByName('prediker')
            let koopman = rolesfolder.childByName('koopman')
            let condotierre = rolesfolder.childByName('condotierre')
        
            this.store.add(new Card({cost:3 ,name:'jachtslot',      role:koning.id,         image:'/res/jachtslot.png'}),deck).duplicate(4)
            this.store.add(new Card({cost:4 ,name:'slot',       role:koning.id,         image:'/res/slot.png'}),deck).duplicate(3)
            this.store.add(new Card({cost:5 ,name:'paleis',     role:koning.id,         image:'/res/paleis.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:1 ,name:'tempel',     role:prediker.id,         image:'/res/tempel.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:2 ,name:'kerk',       role:prediker.id,         image:'/res/kerk.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:3 ,name:'abdij',      role:prediker.id,         image:'/res/abdij.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:4 ,name:'kathedraal',     role:prediker.id,         image:'/res/kathedraal.png'}),deck).duplicate(1)
            this.store.add(new Card({cost:1 ,name:'taveerne',       role:koopman.id,         image:'/res/taveerne.png'}),deck).duplicate(4)
            this.store.add(new Card({cost:2 ,name:'gildehuis',      role:koopman.id,         image:'/res/gildehuis.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:2 ,name:'markt',      role:koopman.id,         image:'/res/markt.png'}),deck).duplicate(3)
            this.store.add(new Card({cost:3 ,name:'handelshuis',        role:koopman.id,         image:'/res/handelshuis.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:4 ,name:'haven',      role:koopman.id,         image:'/res/haven.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:5 ,name:'raadhuis',       role:koopman.id,         image:'/res/raadhuis.png'}),deck).duplicate(1)
            this.store.add(new Card({cost:1 ,name:'wachttoren',     role:condotierre.id,         image:'/res/wachttoren.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:2 ,name:'kerker',     role:condotierre.id,         image:'/res/kerker.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:3 ,name:'toernooiveld',       role:condotierre.id,         image:'/res/toernooiveld.png'}),deck).duplicate(2)
            this.store.add(new Card({cost:5 ,name:'vesting',        role:condotierre.id,         image:'/res/vesting.png'}),deck).duplicate(1)
            this.store.add(new Card({cost:2 ,name:'hof_der_wonderen',       role:null,         image:'/res/hofderwonderen.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:3 ,name:'verdedigingstoren',      role:null,         image:'/res/verdedigingstoren.png'}),deck).duplicate(1)
            this.store.add(new Card({cost:5 ,name:'laboratorium',       role:null,         image:'/res/laboratorium.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:5 ,name:'smederij',       role:null,         image:'/res/smederij.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:5 ,name:'observatorium',      role:null,         image:'/res/observatorium.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:5 ,name:'kerkhof',        role:null,         image:'/res/kerkhof.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:6 ,name:'bibliotheek',        role:null,         image:'/res/bibliotheek.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:6 ,name:'school_voor_magiers',        role:null,         image:'/res/schoolvoormagiers.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:6 ,name:'drakenburcht',       role:null,         image:'/res/drakenburcht.png'}),deck).duplicate(0)
            this.store.add(new Card({cost:6 ,name:'universiteit',       role:null,         image:'/res/universiteit.png'}),deck).duplicate(0)

            shuffle(deckfolder.children,this.rng)
            let roles = this.store.getRoles()
            for(let role of roles){
                role.player = null
            }

            for(let player of this.store.getPlayers()){
                player.money = 2
                player.childByName('board').removeChildren()
                player.childByName('hand').removeChildren()
                this.drawCards(player,2)
            }

            
            game.crownwearerid = this.store.getPlayers().first().id
            game.burgledRoleid = null
            game.murderedRoleid = null
            game.status = 'started'
            game.roleturnid = roles.first().id
            game.flag()
            this.input.add('roundstart',{})
        })

        this.input.listen('roundstart', (e) => {
            let players = this.store.getPlayers()
            let charttable = {
                2:0,
                3:0,
                4:2,
                5:1,
                6:0,
                7:0,
            }

            //first pick is kingplayer
            if(players.length == 2){
                kingDiscard();
                pick();pass();//A
                pick();discardClosed(1);pass();//B
                pick();discardClosed(1);pass();//A
                pick();discardClosed(1);pass();//B
            }else if(players.length == 3){
                kingDiscard();
                pick();pass();//A
                pick();pass();//B
                pick();pass();//C
                pick();pass();//A
                pick();pass();//B
                pick();pass();//C
            }else{
                discardOpen(charttable[players.length])
                kingDiscard()
                for(let player of players){
                    if(players.length == 7 && player == players.last()){
                        pickWithKingCard()
                        pass()
                    }else{
                        pick()
                        pass()
                    }
                }
            }

            function kingDiscard(){

            }

            function discardOpen(count){
                //if 1 is king shuffle it back in roles
            }

            function discardClosed(count){

            }

            function pick(){

            }

            function pickWithKingCard(){

            }

            function pass(){

            }

            for(let player of this.store.getPlayers()){
                player.specialUsed = false
            }
            let rolestoPick = this.store.getRoles()
            this.input.add('rolepick',{player:this.store.getPlayers().first(),roles:rolestoPick})
        })

        this.input.listen('rolepick', (e) => {
            let players = this.store.getPlayers()

            this.discoverRole(e.player,e.roles,(index) => {
                e.roles.remove(index)

                if(e.roles.length > 0){
                    let nextplayer = players[(players.findIndex(p => p.id == e.player.id) + 1) % players.length]
                    this.input.add('rolepick',{player:nextplayer,roles:e.roles})
                }else{
                    this.input.add('roleturn', this.store.getRoles().first().id)
                }
            })
        })

        this.input.listen('roleturn', (e) => {
            let game = this.store.getGame()
            let role = this.store.get(game.roleturnid) as Role
            if(role.player == null || game.murderedRoleid == role.id){
                this.incrementRoleTurn()
            }else{
                let player = this.store.get(role.player) as Player
                player.buildactions = 1

                this.discover(player,[new DiscoverOption({description:'money'}),new DiscoverOption({description:'cards'})],(e) => {
                    if(e.data == 'money'){
                        player.money += 2
                    }else if(e.data == 'cards'){

                        let top2 = this.store.getDeckFolder()._children().slice(0,2) as Card[]
                        this.discoverCard(player,top2,(e) => {
                            let hand = player.childByName('hand')
                            top2[e].setParent(hand)
                        })
                    }
                })
            }
        })


        this.input.addRule('specialability','not your turn',() => {
            return false
        })

        this.input.addRule('specialability','ability already used',() => {
            return false
        })

        this.input.listen('specialability', (e) => {
            let game = this.store.getGame()
            let role = this.store.get(game.roleturnid) as Role
            let player = this.store.get(role.player) as Player
            

            if(role.name == 'moordenaar'){
                let roles = this.store.getRoles().slice(1)
                this.discoverRole(player,roles,(i) => {
                    game.murderedRoleid = roles[i].id
                })
            }else if(role.name == 'dief'){
                let roles = this.store.getRoles().slice(2)
                this.discoverRole(player,roles,(i) => {
                    game.burgledRoleid = roles[i].id
                })
            }else if(role.name == 'magier'){
                this.discover(player,[
                    new DiscoverOption({description:'swapplayer',image:'',value:'swapplayer'}),
                    new DiscoverOption({description:'swapdeck',image:'',value:'swapdeck'})
                ],(i,val) => {
                    if(val == 'swapplayer'){
                        let otherplayers = this.store.getPlayers().filter(p => p.id != player.id)
                        this.discoverPlayer(player,otherplayers,(i) => {
                            player.childByName('hand').setParent(otherplayers[i])
                            otherplayers[i].childByName('hand').setParent(player)
                        })
                    }else if(val == 'swapdeck'){
                        let discardfolder = this.store.getDiscardFolder()
                        let handcards = player.childByName('hand')._children() as Card[]
                        this.discoverMultipleCards(player,handcards,0,handcards.length,(chosenindices) => {
                            chosenindices.map(index => handcards[index]).forEach(c => c.setParent(discardfolder))
                            this.drawCards(player,chosenindices.length)
                        })
                        
                    }
                })
            }else if(role.name == 'koning'){//some of these abilities can be automated at start of turn
                game.crownwearerid = player.id
                game.flag()
                this.processTaxes(role)
            }else if(role.name == 'prediker'){
                this.processTaxes(role)
            }else if(role.name == 'koopman'){
                player.money++
                player.flag()
                this.processTaxes(role)
            }else if(role.name == 'bouwmeester'){
                this.drawCards(player,2)
                player.buildactions = 3
                player.flag()
            }else if(role.name == 'condotierre'){
                this.processTaxes(role)

                let players = this.store.getRoles().filter(r => r.name != 'prediker').map(r => this.store.get(r.player)) as Player[]
                this.discoverPlayer(player,players,(i) => {
                    let board = players[i].childByName('board')._children() as Card[]
                    this.discoverCard(player,board,(i) => {
                        let building = board[i]
                        player.money -= building.cost - 1
                        building.setParent(game.childByName('discardpile'))
                    })
                })
            }

        })

        this.input.addRule('build','not your turn',() => {
            return false
        })

        this.input.addRule('build','not enough money',() => {
            return false
        })

        this.input.addRule('build','not enough buildactions',() => {
            return false
        })

        this.input.listen('build', (e) => {
            let player = this.store.getCurrentPlayer() as Player
            player.buildactions--
            let card = this.store.get(e.card) as Card
            card.setParent(player.childByName('board'))
            player.money -= card.cost
            player.flag()
        })
        
        this.input.listen('pass',() => {
            this.incrementRoleTurn()
        })

        this.input.listen('gamewon',() => {
            let game = this.store.getGame()
            game.status = 'finished'
            game.flag()
            //determine winner
            //set game to won
        })

        this.input.listen('debugfinishgame',() => {
            let game = this.store.getGame()
            game.status = 'finished'
            game.flag()
            //set game to won
        })

        this.input.listen('requestfullupdate',(data) => {
            //fullupdate
        })
    }


    drawCards(player:Player,amount:number){
        let deckfolder = this.store.getDeckFolder()
        for(let i = 0; i < amount;i++){
            if(deckfolder.children.length > 0){
                let topcard = this.store.get(deckfolder.children[0])
                let hand = player.childByName('hand')
                topcard.setParent(hand)
            }else{
                break
            }    
        }
    }

    incrementRoleTurn(){
        let game = this.store.getGame()
        let roles = this.store.getRoles()

        let nextroleindex = roles.findIndex(r => r.id == game.roleturnid) + 1
        if(nextroleindex >= roles.length){
            //check for winner
            if(this.isGameOver()){
                this.calculatePlayerScores()
                let scoresortedplayers = this.store.getPlayers().sort((a,b) => a.score - b.score)
                let winner = scoresortedplayers.last()
                game.winnerid = winner.id
                game.status = 'finished'
                game.flag()
            }else{
                this.input.add('roundstart',{})
            }
        }else{
            game.roleturnid = roles[nextroleindex].id
            this.input.add('roleturn',{})
        }
        

        game.roleturnid
    }

    isGameOver() {
        return this.store.getPlayers().some(p => p.childByName('board').children.length >= 8) 
    }

    calculatePlayerScores() {
        for(let player of this.store.getPlayers()){
            let buildings = player.childByName('board')._children() as Card[]
            let buildingscore = buildings.reduce((p,c) => p + c.points,0)
            let finishscore = 0
            if(buildings.length >= 8){
                if(this.store.getGame().firstFinishedPlayer == player.id){
                    finishscore = 4
                }else{
                    finishscore = 2
                }
            }

            let uniquecount = new Set(buildings.map(b => b.role)).size
            let combiscore = uniquecount >= 5 ? 3 : 0
            player.score = buildingscore + finishscore + combiscore
            player.flag()
        }
    }

    processTaxes(role:Role){
        let player = this.store.get(role.player) as Player
        player.money += player.childByName('board')._children().filter((c:any) => c.role == role.id).length
        player.flag()
    }

    discoverRole(player:Player,options:Role[],cb:(index:number) => void){
        this.discover(player,options.map(r => new DiscoverOption({description:r.name,image:r.image})),cb)
    }

    discoverPlayer(player:Player,options:Player[],cb:(index:number) => void){
        this.discover(player,options.map(p => new DiscoverOption({description:p.name,image:''})),cb)
    }

    discoverCard(player:Player,options:Card[],cb:(index:number) => void){
        this.discover(player,options.map(c => new DiscoverOption({description:c.name,image:c.image})),cb)
    }

    discoverMultipleCards(player:Player,options:Card[],min,max,cb:(chosen:number[]) => void){
        this.discoverMultiple(player,options.map(c => new DiscoverOption({description:c.name,image:c.image})),min,max,cb)
    }
    
    discover(player:Player,options:DiscoverOption[],cb){
        this.discoverMultiple(player,options,1,1,cb)
    }

    discoverMultiple(player:Player,options:DiscoverOption[],min:number,max:number,cb){
        player.isDiscovering = true
        player.discoverOptions = options
        player.discovermin = min
        player.discovermax = max
        this.store.flag(player.id)
        this.input.startDiscovery('discover',options,cb)
    }

    

}



