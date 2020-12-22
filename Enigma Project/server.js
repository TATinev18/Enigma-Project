const WebSocket = require('ws');
const game = require('./MultiPlayerGame');

const ws = new WebSocket.Server({ port: 8080 });

ws.on('connection',WebSocket =>{
    console.log("CONNECTION INITIATED");
    WebSocket.on('message',message =>{
        let decodedMsg = JSON.parse(message);
        console.log("MESSAGE TYPE: ",decodedMsg.type)
        console.log("MESSAGE RECEIVED",decodedMsg.msg);
    })
    WebSocket.send("BABA PRAVI LUTENICA");
})
