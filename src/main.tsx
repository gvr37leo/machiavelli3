import { GameManager } from './client/gamemanager'
import React from 'react'
import ReactDOM from 'react-dom'
import {Client} from './client'
import { Helper } from './client/helper'
import {MainApp} from './client/tsx/mainapp'

var client = new Client()
var gamemanager = new GameManager()
client.helper = new Helper(gamemanager.store)
client.connectSpoofSocket(null)
gamemanager.eventQueue.addAndTrigger('init',{})
gamemanager.eventQueue.addAndTrigger('playerjoin',{name:'aba'})
gamemanager.eventQueue.addAndTrigger('playerjoin',{name:'bob'})
gamemanager.eventQueue.addAndTrigger('playerjoin',{name:'cas'})
gamemanager.eventQueue.addAndTrigger('playerjoin',{name:'don'})
gamemanager.eventQueue.addAndTrigger('gamestart',{})
client.updateHtml()




var appel = document.querySelector('#app');
renderHTML()


function renderHTML(){
    // ReactDOM.render(client.root, appel)
    ReactDOM.render(<MainApp client={client}></MainApp>, appel)
}
