import { Card, Game, Player, Role } from "./models"
import {Entity, EntityStore} from "../libs/utils/store"

/*

game
    players
        hand
        playedcards
    roles
    deck
    discardpile


*/




export function genDB(db:EntityStore){



    // createplayer({name:'paul'})
    // createplayer({name:'wietse'})
    // createplayer({name:'marijn'})
    // createplayer({name:'geke'})

    // function createplayer(obj){
    //     var player = db.add(new Player(obj),playerfolder)
    //     db.add(new Entity({name:'hand'}),player)
    //     db.add(new Entity({name:'board'}),player)
    // }



    return db
}

export function generateCards(db:EntityStore){

    var game = db.list().find(e => e.name == 'gameroot')

}
