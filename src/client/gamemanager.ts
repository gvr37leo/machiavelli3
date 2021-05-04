import {EventQueue} from '../libs/event/eventqueue'
import {EventSystem} from '../libs/event/eventsystem'
import { Entity, EntityStore } from '../libs/utils/store'
import {RNG, shuffle} from '../libs/utils/utils'
import {genDB, generateCards} from './generateDB'
import { Card, DiscoverOption, Game, Player, Role } from './models'
import {Helper} from './helper'
/*
game
    setup db
    ga door rondes heen totdat minstens 1 iemand 8 of meer gebouwen heeft






gameend
    bereken scores

*/

export class GameManager{

    db = new EntityStore()
    eventQueue = new EventQueue()
    broadcastEvent = new EventSystem<{type:string,data}>()
    sendEvent = new EventSystem<{sessionid:number,type:string,data}>()
    rng = new RNG(Math.floor(Math.random() * 100000))
    helper:Helper
    gameroot: Entity

    constructor(){
        
    }

    setupListeners(){

        this.eventQueue.onRuleBroken.listen(e => {
            this.sendEvent.trigger({type:'error',sessionid:e.event.data.sessionid,data:e.error})
        })

        this.eventQueue.listen('init',() => {
            this.db = new EntityStore()
            this.helper = new Helper(this.db)
            var game = this.db.add(new Game({name:'gameroot'}),null)
            this.gameroot = game
            var rolesfolder = this.db.add(new Entity({name:'rolesfolder'}),game)
            var playerfolder = this.db.add(new Entity({name:'playerfolder'}),game)
            var deck = this.db.add(new Entity({name:'deck'}),game)
            var discardpile = this.db.add(new Entity({name:'discardpile'}),game)
        
            var moordenaar = this.db.add(new Role({name:'moordenaar',color:'white',image:'/res/moordenaar.png'}),rolesfolder)
            var dief = this.db.add(new Role({name:'dief',color:'white',image:'/res/dief.png'}),rolesfolder)
            var magier = this.db.add(new Role({name:'magier',color:'white',image:'/res/magier.png'}),rolesfolder)
            var koning = this.db.add(new Role({name:'koning',color:'yellow',image:'/res/koning.png'}),rolesfolder)
            var prediker = this.db.add(new Role({name:'prediker',color:'blue',image:'/res/prediker.png'}),rolesfolder)
            var koopman = this.db.add(new Role({name:'koopman',color:'green',image:'/res/koopman.png'}),rolesfolder)
            var bouwmeester = this.db.add(new Role({name:'bouwmeester',color:'white',image:'/res/bouwmeester.png'}),rolesfolder)
            var condotierre = this.db.add(new Role({name:'condotierre',color:'red',image:'/res/condotierre.png'}),rolesfolder)
            this.eventQueue.add('gamestart',null)
        })

        this.eventQueue.listen('playerjoin', (e) => {
            var playerfolder = this.helper.getGame().childByName('players')
            var player = this.db.add(new Player({name:e.name}),playerfolder)
            this.db.add(new Entity({name:'hand'}),player)
            this.db.add(new Entity({name:'board'}),player)
        })
        
        this.eventQueue.listen('gamestart',() => {
            //generate deck
            

            this.gameroot = this.db.list().find(e => e.name == 'gameroot')
            var deckfolder = this.helper.getDeckFolder()
            deckfolder.removeChildren()
            
            var deck = game.childByName('deck')
            var rolesfolder = game.childByName('rolesfolder')
            var koning = rolesfolder.childByName('koning')
            var prediker = rolesfolder.childByName('prediker')
            var koopman = rolesfolder.childByName('koopman')
            var condotierre = rolesfolder.childByName('condotierre')
        
            this.db.add(new Card({cost:3 ,name:'jachtslot',      role:koning.id,         image:'/res/jachtslot.png'}),deck).duplicate(5)
            this.db.add(new Card({cost:4 ,name:'slot',       role:koning.id,         image:'/res/slot.png'}),deck).duplicate(4)
            this.db.add(new Card({cost:5 ,name:'paleis',     role:koning.id,         image:'/res/paleis.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:1 ,name:'tempel',     role:prediker.id,         image:'/res/tempel.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:2 ,name:'kerk',       role:prediker.id,         image:'/res/kerk.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:3 ,name:'abdij',      role:prediker.id,         image:'/res/abdij.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:4 ,name:'kathedraal',     role:prediker.id,         image:'/res/kathedraal.png'}),deck).duplicate(2)
            this.db.add(new Card({cost:1 ,name:'taveerne',       role:koopman.id,         image:'/res/taveerne.png'}),deck).duplicate(5)
            this.db.add(new Card({cost:2 ,name:'gildehuis',      role:koopman.id,         image:'/res/gildehuis.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:2 ,name:'markt',      role:koopman.id,         image:'/res/markt.png'}),deck).duplicate(4)
            this.db.add(new Card({cost:3 ,name:'handelshuis',        role:koopman.id,         image:'/res/handelshuis.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:4 ,name:'haven',      role:koopman.id,         image:'/res/haven.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:5 ,name:'raadhuis',       role:koopman.id,         image:'/res/raadhuis.png'}),deck).duplicate(2)
            this.db.add(new Card({cost:1 ,name:'wachttoren',     role:condotierre.id,         image:'/res/wachttoren.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:2 ,name:'kerker',     role:condotierre.id,         image:'/res/kerker.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:3 ,name:'toernooiveld',       role:condotierre.id,         image:'/res/toernooiveld.png'}),deck).duplicate(3)
            this.db.add(new Card({cost:5 ,name:'vesting',        role:condotierre.id,         image:'/res/vesting.png'}),deck).duplicate(2)
            this.db.add(new Card({cost:2 ,name:'hof_der_wonderen',       role:null,         image:'/res/hofderwonderen.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:3 ,name:'verdedigingstoren',      role:null,         image:'/res/verdedigingstoren.png'}),deck).duplicate(2)
            this.db.add(new Card({cost:5 ,name:'laboratorium',       role:null,         image:'/res/laboratorium.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:5 ,name:'smederij',       role:null,         image:'/res/smederij.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:5 ,name:'observatorium',      role:null,         image:'/res/observatorium.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:5 ,name:'kerkhof',        role:null,         image:'/res/kerkhof.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:6 ,name:'bibliotheek',        role:null,         image:'/res/bibliotheek.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:6 ,name:'school_voor_magiers',        role:null,         image:'/res/schoolvoormagiers.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:6 ,name:'drakenburcht',       role:null,         image:'/res/drakenburcht.png'}),deck).duplicate(1)
            this.db.add(new Card({cost:6 ,name:'universiteit',       role:null,         image:'/res/universiteit.png'}),deck).duplicate(1)

            shuffle(deckfolder.children,this.rng)
            var roles = this.helper.getRoles()
            for(var role of roles){
                role.player = null
            }

            for(var player of this.helper.getPlayers()){
                player.money = 2
                player.childByName('board').removeChildren()
                player.childByName('deck').removeChildren()
                this.drawCards(player,2)
            }

            var game = this.helper.getGame()
            game.crownwearerid = this.helper.getPlayers().first().id
            game.burgledRoleid = null
            game.murderedRoleid = null
            game.status = 'started'
            game.roleturnid = roles.first().id
            game.flag()
            this.eventQueue.add('roundstart',{})
        })

        this.eventQueue.listen('roundstart', (e) => {
            var players = this.helper.getPlayers()
            var charttable = {
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
                for(var player of players){
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

            for(let player of this.helper.getPlayers()){
                player.specialUsed = false
            }
            var rolestoPick = this.helper.getRoles()
            this.eventQueue.add('rolepick',{player:this.helper.getPlayers().first(),roles:rolestoPick})
        })

        this.eventQueue.listen('rolepick', (e) => {
            var players = this.helper.getPlayers()

            this.discoverRole(e.player,e.roles,(index) => {
                e.roles.remove(index)

                if(e.roles.length > 0){
                    var nextplayer = players[(players.findIndex(p => p.id == e.player.id) + 1) % players.length]
                    this.eventQueue.add('rolepick',{player:nextplayer,roles:e.roles})
                }else{
                    this.eventQueue.add('roleturn', this.helper.getRoles().first().id)
                }
            })
        })

        this.eventQueue.listen('roleturn', (e) => {
            var game = this.helper.getGame()
            var role = this.db.get(game.roleturnid) as Role
            if(role.player == null || game.murderedRoleid == role.id){
                this.incrementRoleTurn()
            }else{
                var player = this.db.get(role.player) as Player
                player.buildactions = 1

                this.discover(player,[new DiscoverOption({description:'money'}),new DiscoverOption({description:'cards'})],(e) => {
                    if(e.data == 'money'){
                        player.money += 2
                    }else if(e.data == 'cards'){

                        var top2 = this.helper.getDeckFolder()._children().slice(0,2) as Card[]
                        this.discoverCard(player,top2,(e) => {
                            var hand = player.childByName('hand')
                            top2[e].setParent(hand)
                        })
                    }
                })
            }
        })


        this.eventQueue.addRule('specialability','not your turn',() => {
            return false
        })

        this.eventQueue.addRule('specialability','ability already used',() => {
            return false
        })

        this.eventQueue.listen('specialability', (e) => {
            var game = this.helper.getGame()
            var role = this.db.get(game.roleturnid) as Role
            var player = this.db.get(role.player) as Player
            

            if(role.name == 'moordenaar'){
                var roles = this.helper.getRoles().slice(1)
                this.discoverRole(player,roles,(i) => {
                    game.murderedRoleid = roles[i].id
                })
            }else if(role.name == 'dief'){
                var roles = this.helper.getRoles().slice(2)
                this.discoverRole(player,roles,(i) => {
                    game.burgledRoleid = roles[i].id
                })
            }else if(role.name == 'magier'){
                this.discover(player,[
                    new DiscoverOption({description:'swapplayer',image:'',value:'swapplayer'}),
                    new DiscoverOption({description:'swapdeck',image:'',value:'swapdeck'})
                ],(i,val) => {
                    if(val == 'swapplayer'){
                        var otherplayers = this.helper.getPlayers().filter(p => p.id != player.id)
                        this.discoverPlayer(player,otherplayers,(i) => {
                            player.childByName('hand').setParent(otherplayers[i])
                            otherplayers[i].childByName('hand').setParent(player)
                        })
                    }else if(val == 'swapdeck'){
                        var discardfolder = this.helper.getDiscardFolder()
                        var handcards = player.childByName('hand')._children() as Card[]
                        this.discoverMultipleCards(player,handcards,0,handcards.length,(chosenindices) => {
                            chosenindices.map(index => handcards[index]).forEach(c => c.setParent(discardfolder))
                            this.drawCards(player,chosenindices.length)
                        })
                        
                    }
                })
            }else if(role.name == 'koning'){
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

                var players = this.helper.getRoles().filter(r => r.name != 'prediker').map(r => this.db.get(r.player)) as Player[]
                this.discoverPlayer(player,players,(i) => {
                    var board = players[i].childByName('board')._children() as Card[]
                    this.discoverCard(player,board,(i) => {
                        var building = board[i]
                        player.money -= building.cost - 1
                        building.setParent(game.childByName('discardpile'))
                    })
                })
            }

        })

        this.eventQueue.addRule('build','not your turn',() => {
            return false
        })

        this.eventQueue.addRule('build','not enough money',() => {
            return false
        })

        this.eventQueue.addRule('build','not enough buildactions',() => {
            return false
        })

        this.eventQueue.listen('build', (e) => {
            var player = this.helper.getCurrentPlayer() as Player
            player.buildactions--
            var card = this.db.get(e.card) as Card
            card.setParent(player.childByName('board'))
            player.money -= card.cost
            player.flag()
        })
        
        this.eventQueue.listen('pass',() => {
            this.incrementRoleTurn()
        })

        this.eventQueue.listen('gamewon',() => {
            var game = this.helper.getGame()
            game.status = 'finished'

            //determine winner
            //set game to won
        })

        this.eventQueue.listen('debugfinishgame',() => {
            var game = this.helper.getGame()
            game.status = 'finished'
            //set game to won
        })

        this.eventQueue.listen('requestfullupdate',(data) => {
            //fullupdate
        })
    }


    drawCards(player:Player,amount:number){
        var deckfolder = this.helper.getDeckFolder()
        for(var i = 0; i < 10;i++){
            if(deckfolder.children.length > 0){
                var topcard = this.db.get(deckfolder.children[0])
                var hand = player.childByName('hand')
                topcard.setParent(hand)
            }else{
                break
            }    
        }
    }

    incrementRoleTurn(){
        var game = this.helper.getGame()
        var roles = this.helper.getRoles()

        var nextroleindex = roles.findIndex(r => r.id == game.roleturnid) + 1
        if(nextroleindex >= roles.length){
            //check for winner
            if(this.isGameOver()){
                this.calculatePlayerScores()
                var scoresortedplayers = this.helper.getPlayers().sort((a,b) => a.score - b.score)
                var winner = scoresortedplayers.last()
                game.winnerid = winner.id
                game.status = 'finished'
                game.flag()
            }else{
                this.eventQueue.add('roundstart',{})
            }
        }else{
            game.roleturnid = roles[nextroleindex].id
            this.eventQueue.add('roleturn',{})
        }
        

        game.roleturnid
    }

    isGameOver() {
        return this.helper.getPlayers().some(p => p.childByName('board').children.length >= 8) 
    }

    calculatePlayerScores() {
        for(var player of this.helper.getPlayers()){
            var buildings = player.childByName('board')._children() as Card[]
            var buildingscore = buildings.reduce((p,c) => p + c.points,0)
            var finishscore = 0
            if(buildings.length >= 8){
                if(this.helper.getGame().firstFinishedPlayer == player.id){
                    finishscore = 4
                }else{
                    finishscore = 2
                }
            }

            var uniquecount = new Set(buildings.map(b => b.role)).size
            var combiscore = uniquecount >= 5 ? 3 : 0
            player.score = buildingscore + finishscore + combiscore
            player.flag()
        }
    }

    processTaxes(role:Role){
        var player = this.db.get(role.player) as Player
        player.money += player.childByName('board')._children().filter((c:Card) => c.role == role.id).length
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
        this.db.flag(player.id)
        this.eventQueue.startDiscovery('discover',options,cb)
    }

    

}


