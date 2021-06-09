import React from 'react'
import ReactDOM from 'react-dom'
import {Client} from './client'
import {MainApp} from './client/mainapp'
import {io} from 'socket.io-client'

const socket = io({
    // reconnection:false,
    autoConnect: false,
});

socket.open()
//clientside
let client = new Client()



// let appel = document.querySelector('#app');
// ReactDOM.render(client.root,appel)
// client.special.on('updatehtml',() => {
//     ReactDOM.render(client.root,appel)
// })





















