/*const WebSocket = require('ws');
let io = require("socket.io")();
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
}*/
const server = require('http').createServer();
let britains =[];
let germans = [];
var roomCount=0;
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

function matchMake()
{
    if(germans.length==0 || britains.length==0)
        return 0;
    let r1 = Math.floor(Math.random() * (germans.length-1));
    let r2 = Math.floor(Math.random() * (britains.length-1));
    germans[r1].join("room"+roomCount);
    britains[r2].join("room"+roomCount);
    console.log(britains[r2]);
    roomCount++;
    germans.splice(r1,1);
    britains.splice(r2,1);
    return "room"+(roomCount-1);
}

io.on('connection', socket => {
    socket.on("matchMake", (data)=>{
        console.log(data);
        if(data.side=="British") {
            britains.push(socket);
            console.log("1 british");
        }
        else {
            germans.push(socket);
            console.log("1 german");
        }
        let room = matchMake();
        if(room)
        {
            io.to(room).emit('begin');
        }
    });
});

while(germans.length>0 && britains.length>0)
{
    matchMake();
}

server.listen(8080);
