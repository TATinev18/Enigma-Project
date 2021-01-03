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
let app = require("./MultiPlayerGame.js");
let britains = [];
let germans = [];
var roomCount = 0;
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

function matchMake() {
    if (germans.length == 0 || britains.length == 0)
        return 0;

    let r1 = Math.floor(Math.random() * (germans.length - 1));
    let r2 = Math.floor(Math.random() * (britains.length - 1));
    germans[r1].socket.join("room" + roomCount);
    britains[r2].socket.join("room" + roomCount);
    console.log(britains[r2]);

    let obj = {
        room: "room" + roomCount,
        ger: { socket: germans[r1].socket, name: germans[r1].user },
        gbr: { socket: britains[r2].socket, name: britains[r2].user }
    }

    roomCount++;
    germans.splice(r1, 1);
    britains.splice(r2, 1);
    return obj;
}

io.on('connection', socket => {
    socket.on("matchMake", (data) => {
        if (data.side == "British") {
            britains.push({ socket: socket, user: data.user });
            console.log("1 british");
        }
        else {
            germans.push({ socket: socket, user: data.user });
            console.log("1 german");
        }

        let users = matchMake();

        if (users) {
            io.to(users.room).emit('begin');

            users.ger.socket.on("chat", (msg) => {
                io.to(users.room).emit("chat", { user: users.ger.name, msg: msg });
            });
            users.gbr.socket.on("chat", (msg) => {
                io.to(users.room).emit("chat", { user: users.gbr.name, msg: msg });
            });

            let game = new app.MultiPlayerGame();

            users.ger.socket.emit("initNum");

        }
    });
});

while (germans.length > 0 && britains.length > 0) {
    matchMake();
}

server.listen(8080);
