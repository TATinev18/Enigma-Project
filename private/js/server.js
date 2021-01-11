const express = require('express');
var bodyParser = require('body-parser')
let db = require('./DB');
var crypto = require('crypto');
let resetPassword = require('./emailsManagment');
var cookieParser = require('cookie-parser')
var app = express();
const server = require('http').createServer(app);
let register = require('./register');
var path = require('path');
let MP = require("./MultiPlayerGame");
let con = db.connection;
let britains = [];
let germans = [];
var roomCount = 0;
let resetPasswordEmail;
var hash = crypto.createHash('sha256');
let res;
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
////////////////////////////////// VANKA SPACE////////////////////
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/js", express.static(__dirname + "/../../public/js"));
app.use("/css", express.static(__dirname + "/../../public/css"));
app.use("/photos", express.static(__dirname + "/../../public/photos"));
app.use(cookieParser());
//app.set('view engine','ejs');

// parse application/jso n
app.use(bodyParser.json())
////////////////////////////////////////////////////////////////////

function matchMake() {
    if (germans.length == 0 || britains.length == 0)
        return 0;

    let r1 = Math.floor(Math.random() * (germans.length - 1));
    let r2 = Math.floor(Math.random() * (britains.length - 1));
    germans[r1].socket.join("room" + roomCount);
    britains[r2].socket.join("room" + roomCount);

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

app.post('/login',function (request,response) {
    let username = request.body.username;
    let password = request.body.password;
    console.log(username+' '+password);
    let hashPassword = crypto.createHash('sha256').update(password).digest('base64');
    console.log(hashPassword);
    con.query('SELECT * FROM users WHERE username=? AND password=?',[username,hashPassword],function (error,result,field) {
        if (error!=null && error!=undefined){
            console.log(error);
        }
        console.log(result);
        if (result.length>0){
            if (result[0].username==username&&result[0].password ==hashPassword){
                response.send('logged');
            }
        }
    })
})

app.post('/resetPassword',function (request,response) {
    let email=request.body.email;
    let token = email+ new Date().toLocaleString();
    token = crypto.createHash('sha256').update(token).digest('base64');
    console.log(token);
    console.log(email);
    con.query('SELECT * FROM users WHERE email=?', [email], function (error, result, fields) {
        if (error!=null && error!=undefined){
            console.log(error);
        }if (result.length>0){
            if (result[0].email==email){
                con. query('INSERT INTO ressetpassword (email,token) VALUES  (?,?)', [email,token], function (error, result, fields) {
                    if (error!=null && error!=undefined){
                        console.log(error);
                    }else{
                        res ='0';
                        resetPasswordEmail=email;
                        response.cookie('Biskvita',email);
                        response.send('');
                        resetPassword.resetPassword(email,token);
                    }
                });
            }
        }else {
            res = 'emailReset';
        }
    });
});

app.post('/register',function (request,response) {
    let username = request.body.username;
    let email = request.body.email;
    let password = request.body.password;
    console.log("SLIVI");
    let hashPassword = crypto.createHash('sha256').update(password).digest('base64');
    con.query('SELECT * FROM users WHERE username=? OR email=?', [username,email], function (error, result, fields) {
        if (error!=null && error!=undefined){
            console.log(error);
        }
        if (result.length>0){
            if (result[0].username==username){
                res='username'
            }
            if (result[0].email ==email){
                res = 'email';
            }
            return res;
        }

        else{
            console.log(password);
            con.query('INSERT INTO users (username, email, password) VALUES  (?, ?, ?)', [username,email,hashPassword], function (error, result, fields) {
                if (error!=null && error!=undefined){
                    console.log(error);
                }else{
                 res = '0';

                }
            })
        }
    });
})
app.post('/setNewPassword',function (request,response) {
    let password = request.body.password;
    console.log('slivki EMAIL');
    let hashPassword = crypto.createHash('sha256').update(password).digest('Hex');
    email = request.cookies;
    email=email.Biskvita;
    console.log(email);
    con.query('UPDATE users SET password=? WHERE email=?', [hashPassword,email],function (error,result,field) {
        if (error!=null && error!=undefined){
            console.log(error);
        }else{
            console.log('STANA');
        }
    })
})
app.get('/checkToken',function (request,response) {
        console.log(request.query);
    console.log(request.cookie)
    let token = request.query.token;
    let email = request.cookie;
    console.log(token);
    con.query('SELECT email FROM ressetpassword WHERE token=?',[token],function (error,result,field) {
        if (error!=null && error!=undefined){
            console.log(error);
        }console.log(token);
        if (result.length>0){
            email=result.email;
            response.sendFile(path.join(__dirname + '/../../public/HTML/newPassword.html'));
        }
    })
});

app.get('/',function (request,response) {
   response.sendFile(path.join(__dirname + '/../../public/HTML/resetPassword.html'));
})
function isValidData(obj,arg,expectedVal) {
    let status = {
        err: ""
    };
    if(obj.length) {
        if(obj.hasOwnProperty(arg)) {
            if(obj.arg!=expectedVal) {
                status.err="";
            } else {
                status.err="Unexpected data value!";
            }
        } else {
            status.err="No property "+arg+" found in "+obj;
        }
    } else {
        status.err="The object doesn't exist / hasn't been received correctly";
    }
    return status;
}

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
            users.ger.socket.emit("forceTurn");

            let game = new MP.MultiPlayerGame();

            game.initMapProvinces();

            users.ger.socket.on("getCode",(code)=>{
                console.log(code);
                game.setCode(code);
            });
            users.ger.socket.on("getProvinces", ()=>{
                users.ger.socket.emit("receiveProvinces", game.getProvinces());
            });

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
            users.ger.socket.on("getCurrency",() => {users.ger.socket.emit("updateCurrency",game.getGold())});
            users.gbr.socket.on("getCurrency",() => {users.gbr.socket.emit("updateCurrency",game.getPoints())});
            users.ger.socket.on("requestProvinces", ()=>{
                users.ger.socket.emit("receiveProvinces",game.getProvinces());
            });

            users.ger.socket.on("createFarm", (province) => {
                if (province) {
                    if (game.getGold() >= 200) {
                        if (game.getProvinces().ger[province].hasFarm == false) {
                            game.updateGold(game.getGold() - 200);
                            game.createFarm(province);
                            users.ger.socket.emit("farmResult", { status: "Farm successfully created!" });
                        } else {
                            users.ger.socket.emit("farmResult", { status: "Province already has farm" });
                        }
                    } else {
                        users.ger.socket.emit("farmResult", { status: "Not enough gold!" });
                    }
                } else {
                    users.ger.socket.emit("farmResult", { status: "Incorrect province (internal server error, please try again)" })
                }
            });

            users.gbr.socket.on("scan", (province) => {
                if (province) {
                    if (game.getPoints() >= 10) {
                        if (game.useScan(province)) {
                            users.gbr.socket.emit("scanResult", { status: "Success, farm destroyed" });
                        } else {
                            users.gbr.socket.emit("scanResult", { status: "Failure, no farm detected" });
                        }
                    } else {
                        users.gbr.socket.emit("scanResult", { status: "Not enough money" });
                    }
                } else {
                    users.gbr.socket.emit("scanResult", { status: "Incorrect province (internal server error, please try again)" });
                }
            });

            users.ger.socket.on("fleet", (fleet) => {
                if (fleet) {
                    if (fleet.price <= game.getGold()) {
                        game.createFleet(fleet.plane, fleet.ship, fleet.LC);
                        game.updateGold(game.getGold() - fleet.price);
                        console.log(game.getFleets())
                        users.ger.socket.emit("fleetResult", { status: "Success" });
                    } else {
                        users.ger.socket.emit("fleetResult", { status: "Fail" });
                    }
                } else {
                    users.ger.socket.emit("fleetResult", { status: "No fleet detected, internal server error, please try again!" });
                }
            });

            users.gbr.socket.on("guess", (input) => {
                let result =game.checkUserInput(input);
                if(result.err=="") {
                    io.to(users.room).emit("history", game.getHistory());
                    if(game.checkVictoryConditions(input)==game.getVICTORY().BRITISH) {
                        io.in(users.room).emit("victory",{victory:"BRITISH"});
                        game.reset();
                    }
                    if(game.checkVictoryConditions(input)==game.getVICTORY().GERMAN) {
                        io.in(users.room).emit("victory",{victory:"GERMAN"});
                        game.reset();
                    }
                }
            });
        }
    });
    socket.on('register', ()=>{
            console.log("SERVER ");
          socket.emit('serverValidation',res);
    });
});

server.listen(8080)

/*
-client connection to server $
-client match make $
-chat $
=====BEGIN GAME====
-german enter number => end turn
-british guess number and/or use points for scan $
-scan (server) $
-scan (client) &
end turn
german create fleet $
german create farm (server) $
end turn
*repeat 13 times or until brit guesses num* $
*attack event for germans on 13th turn* $
*victor conditions* $
=====END GAME======
* ensure all user input

*/
