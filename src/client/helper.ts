import { Entity, EntityStore } from "../libs/utils/store"
import { Card, Game, Player, Role } from "./models"

export class Helper{

    constructor(public db:EntityStore){

    }

    getCurrentPlayer(){
        var game = this.getGame()
        var activerole = this.getRoles().find(r => r.id == game.roleturnid)
        var activeplayer = this.db.get(activerole.player)
        return activeplayer
    }

    getGame():Game{
        return this.db.list().find(e => e.name == 'gameroot') as Game
    }

    getPlayers():Player[]{
        return this.getGame().childByName('players')._children() as Player[]
    }

    getDeckFolder():Entity{
        return this.getGame().childByName('deck')
    }

    getDiscardFolder(){
        return this.getGame().childByName('discardpile')
    }

    getDiscardPile():Card[]{
        return this.getDiscardFolder()._children() as Card[]
    }

    getRoles():Role[]{
        return this.getGame().childByName('roles')._children() as Role[]
    }

    getClientPlayer(clientid):Player{
        return this.getPlayers().find(p => p.clientid == clientid)
    }

    getSessionPlayer(sessionid):Player{
        return this.getPlayers().find(p => p.sessionid == sessionid)
    }
}
