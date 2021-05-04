import {Vector} from './libs/vector/vector'
import {createCanvas,loop} from './libs/utils/utils'
import { GameManager } from './client/gamemanager'
import React from 'react'
import ReactDOM from 'react-dom'
import {Client} from './client'

var client = new Client()
var gamemanager = new GameManager()

gamemanager.eventQueue.addAndTrigger('gamestart',{})
gamemanager.db

var appel = document.querySelector('#app');
function renderHTML(){
    ReactDOM.render(client.root, appel)
}
