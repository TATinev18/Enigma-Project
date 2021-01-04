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

function retry(socket, msg) {
    socket.emit("retry", msg);
}

//user input checks

io.on('connection', socket => {
    socket.on("matchMake", (data) => {
        if (data && (data.side == "British" || data.side == "German")) {
            if (data.side == "British") {
                britains.push({ socket: socket, user: data.user });
                console.log("1 british");
            }
            else if (data.side == "German") {
                germans.push({ socket: socket, user: data.user });
                console.log("1 german");
            }
            else {
                retry(socket, "Invalid side. try again.");
                socket.disconnect();
                return;
            }
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
            users.ger.socket.on("endTurn", () => {
                users.gbr.socket.emit("beginTurn");
            });
            users.gbr.socket.on("endTurn", () => {
                users.ger.socket.emit("beginTurn");
                game.calculateGoldNewTurn();
            });

            users.ger.socket.on("farm", (data) => {
                game.createFarm(data.province);
            });

            users.gbr.socket.on("scan", (data) => {
                game.useScan(data.province);
            });

            users.ger.socket.on("fleet", (fleet) => {
                console.log("received fleet");
                if (fleet.price <= game.getGold()) {
                   /*if(fleet.plane==0 && fleet.ship==0 && fleet.LC==0) {

                   } */
                    game.createFleet(fleet.plane, fleet.ship, fleet.LC);
                    game.updateGold(game.getGold()-fleet.price);

                    users.ger.socket.emit("fleetResult", "Success");
                } else {
                    users.ger.socket.emit("fleetResult", "Fail");
                }
            });

            users.ger.socket.emit("initNum");

            users.gbr.socket.on("guess", (input) => {
                console.log(input);
                console.log(game.checkUserInput(input));
            });
        }
    });
});

server.listen(8080);

/*
-client connection to server $
-client match make $
-chat $
=====BEGIN GAME====
-german enter number => end turn
-british guess number and/or use points for scan
-scan (server) $
end turn
german create fleet (server) $
german create farm (server) $
end turn
*repeat 13 times or until brit guesses num*
*attack event for germans on 13th turn*
*victor conditions*
=====END GAME======
* ensure all user input

*/
