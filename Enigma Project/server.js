const WebSocket = require('ws');

const ws = new WebSocket.Server({ port: 8080 });

ws.on('connection',WebSocket =>{
    console.log("Pryskam");
    WebSocket.on('message',message =>{
        console.log("poluchih ",message);
    })
    WebSocket.send("BABA PRAVI LUTENICA");
})
