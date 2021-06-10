// import React from 'react'
// import ReactDOM from 'react-dom'
// import {Client} from './client.js'
// import {MainApp} from './client/mainapp'

import { ClientSocket } from "./clientsocket";

// var client = new Client()
const socket = io({
    // reconnection:false,
    autoConnect: false,
});

//clientside
// let client = new Client()
var clientsocket = new ClientSocket()

clientsocket.connect(socket)


let appel = document.querySelector('#app');
// ReactDOM.render(<div>hello world</div>,appel)
// client.special.on('updatehtml',() => {
//     ReactDOM.render(client.root,appel)
// })





















