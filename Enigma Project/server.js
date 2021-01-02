const WebSocket = require('ws');
const game = require('./MultiPlayerGame');

const ws = new WebSocket.Server({ port: 8080 });
let games = [];
let lobbyMaker =[];
ws.on('connection', server => {
    console.log("CONNECTION INITIATED");
    server.on('message', message => {
        decodeMSG(message);

    });
    server.send("CLIENT CONNECTION ESTABLISHED");
});

function decodeMSG(msg) {
    let decodedMsg = JSON.parse(msg);
    console.log("MESSAGE TYPE: ", decodedMsg.type)
    console.log("MESSAGE RECEIVED", decodedMsg.data);
    console.log("SENDER", decodedMsg.sender);
    switch (decodedMsg.type) {
        case "chat":
            ws.clients.forEach(client=>{
                client.send(msg);
            });
            break;
        case "matchMakingUnranked":
            matchMaker(decodedMsg);
            break;
    }
}
//------------------------------------
function matchMaker(data){
    let side = data.data;
    if (side == "German"){
        for (let i = 0; i < lobbyMaker.length;i++){
            if (lobbyMaker[i]==0.25){

            }
        }
    }
}
