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
    };

    roomCount++;
    germans.splice(r1, 1);
    britains.splice(r2, 1);
    return obj;
}

//user input checks

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
            users.gbr.socket.emit("endTurn");
            let game = new app.MultiPlayerGame();
            game.initMapProvinces();

            users.ger.socket.on("chat", (msg) => {
                io.to(users.room).emit("chat", { user: users.ger.name, msg: msg });
                game.recordChat({ user: users.ger.name, msg: msg });
            });
            users.gbr.socket.on("chat", (msg) => {
                io.to(users.room).emit("chat", { user: users.gbr.name, msg: msg });
                game.recordChat({ user: users.gbr.name, msg: msg });
            });
            users.ger.socket.on("endTurn",()=>{
                users.gbr.socket.emit("beginTurn");
            });
            users.gbr.socket.on("endTurn",()=>{
                users.ger.socket.emit("beginTurn");
                game.calculateGoldNewTurn();
            });

            users.ger.socket.on("farm", (data)=>{
                game.createFarm(data.province);
            });

            users.gbr.socket.on("scan", (data)=>{
                game.useScan(data.province);
            });

            users.ger.socket.on("fleet", (fleet)=>{
                game.createFleet(fleet.p,fleet.s,fleet.LC);
            });

            users.ger.socket.emit("initNum");

            users.gbr.socket.on("guess",(input)=>{
                console.log(input);
                console.log(game.checkUserInput(input));
            });
        }
    });
});

server.listen(8080);
