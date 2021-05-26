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
const { Console } = require('console');
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

app.post('/login',function (request,response) {
    let dataFromForm = request.body.username;
    let password = request.body.password;
    let time;
    console.log("Parola pri login : "+password);
    console.log(dataFromForm+' '+password);
    let hashPassword = crypto.createHash('sha256').update(password).digest('base64');
    console.log(hashPassword);
    con.query('SELECT * FROM users WHERE username=? AND password=? OR email=? AND password=?',[dataFromForm,hashPassword,dataFromForm,hashPassword],function (error,result,field) {
        if (error!=null && error!=undefined){
            console.log(error);
        }
        console.log(result);
        if (result.length>0){
                if (request.body.remember){
                    time = 31*24*3600000;
                }else{
                    time =  600000;
                }
                response.cookie('ur',result[0].username, {maxAge: time});
                response.cookie('mr',result[0].mmr,  {maxAge: time});
                response.sendFile(path.join(__dirname + '/../../public/HTML/index.html'));
        }else {
            res = 'invalid credentials';
        }
        });
    });
app.get('/logout',function (request,response) {
    response.cookie('ur',result[0].username, {maxAge: 0});
    response.cookie('mr',result[0].mmr,  {maxAge: 0});
    response.sendFile(path.join(__dirname + '/../../public/HTML/index.html'));
});
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
    console.log("Parola : "+password);
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
                    response.sendFile(path.join(__dirname + '/../../public/HTML/login.html'));
                }
            })
        }
    });
})
app.post('/setNewPassword',function (request,response) {
    let password = request.body.password;
    console.log('slivki EMAIL');
    let hashPassword = crypto.createHash('sha256').update(password).digest('base64');
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
});

app.get('/getIndex',function (request,response) {
    response.sendFile(path.join(__dirname + '/../../public/HTML/index.html'));
 });


app.get('/getLogin',function (request,response) {
    response.sendFile(path.join(__dirname + '/../../public/HTML/login.html'));
});

app.get('/game-menu',function (request,response) {
    response.sendFile(path.join(__dirname + '/../../public/HTML/game-menu.html'));
});

app.get('/single-player',function (request,response) {
    response.sendFile(path.join(__dirname + '/../../public/HTML/single-player.html'));
});

app.get('/multi-player',function (request,response) {
    response.sendFile(path.join(__dirname + '/../../public/HTML/multi-player.html'));
});

app.get('/getRegister',function (request,response) {
    response.sendFile(path.join(__dirname + '/../../public/HTML/register.html'));
});


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

function sendStatus(socket,data,type) {
    let obj = {
        status: data,
        type: type
    }
    socket.emit("statusReport",obj);
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
                let result =game.checkUserInput(code);
                console.log(result);
                if(result.err=="") {
                    game.setCode(code);
                    game.clearHistoryAndGuessedNums();
                    users.ger.socket.emit("approveCode");
                } else {
                    sendStatus(users.ger.socket,"invalid Number, "+result.err,"err");
                }
            });
            users.ger.socket.on("getProvinces", ()=>{
                users.ger.socket.emit("receiveProvinces", game.getProvinces());
            });

            users.ger.socket.on("chat", (data) => {
                io.to(users.room).emit("chat", { user: users.ger.name, msg: data.msg, side:data.side });
                game.recordChat({ user: users.ger.name, msg: data.msg });
            });
            users.gbr.socket.on("chat", (data) => {
                io.to(users.room).emit("chat", { user: users.gbr.name, msg: data.msg, side:data.side });
                game.recordChat({ user: users.gbr.name, msg: data.msg });
            });
            users.ger.socket.on("endTurn", () => {
                users.gbr.socket.emit("beginTurn");
            });
            users.gbr.socket.on("endTurn", () => {
                users.ger.socket.emit("beginTurn");
                game.calculateGoldNewTurn();
            });
            users.ger.socket.on("getCurrency",() => {users.ger.socket.emit("updateCurrency",{gold:game.getGold(),GPT:game.getGoldPerTurn()})});
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
                            sendStatus(users.ger.socket,"Farm successfully created!","succ");
                        } else {
                            sendStatus(users.ger.socket,"Province already has farm","warn");
                        }
                    } else {
                        sendStatus(users.ger.socket,"Not enough gold!","warn");
                    }
                } else {
                    sendStatus(users.ger.socket,"Incorrect province (internal server error, please try again)","err");
                }
            });

            users.gbr.socket.on("scan", (province) => {
                if (province) {
                    if (game.getPoints() >= 10) {
                        if (game.useScan(province)) {
                            users.gbr.socket.emit("scanResult", { status: "Success, farm destroyed" });
                            sendStatus(users.gbr.socket,"Success, farm destroyed","succ");
                        } else {
                            sendStatus(users.gbr.socket,"Failure, no farm detected","warn");
                        }
                    } else {
                        sendStatus(users.gbr.socket,"Not enough gold","warn");
                    }
                } else {
                    sendStatus(users.gbr.socket,"Incorrect province (internal server error, please try again)","err");
                }
            });

            users.ger.socket.on("fleet", (fleet) => {
                if (fleet) {
                    if (fleet.price <= game.getGold()) {
                        game.createFleet(fleet.plane, fleet.ship, fleet.LC);
                        game.updateGold(game.getGold() - fleet.price);
                        console.log(game.getFleets())
                        users.ger.socket.emit("fleetResult", { status: "Success" });
                        sendStatus(users.ger.socket,"Fleet successfully created!","succ");
                    } else {
                        sendStatus(users.ger.socket,"Not enough gold!","warn");
                    }
                } else {
                    sendStatus(users.ger.socket,"No fleet detected, internal server error, please try again!","err");
                }
            });

            users.gbr.socket.on("guess", (input) => {
                let result =game.checkUserInput(input);
                if(result.err=="") {
                    io.to(users.room).emit("history", game.getHistory());
                    io.to(users.room).emit("round",game.getRounds());
                    console.log(game.getRounds());
                    if(game.checkVictoryConditions(input)==game.getVICTORY().BRITISH) {
                        io.in(users.room).emit("victory",{victory:"BRITISH", type:"normal"});
                        game.reset()
                        if(game.getLevel()==1) {
                            game.updateLevel(2);
                        } else {
                            game.updateGameOver(true);
                        }
                    }
                    if(game.checkVictoryConditions(input)==game.getVICTORY().GERMAN) {
                        io.in(users.room).emit("victory",{victory:"GERMAN", type:"normal"});
                        game.reset();
                        if(game.getLevel()==1) {
                            game.updateLevel(2);
                        } else {
                            game.updateGameOver(true);
                        }
                    }
                }
                else {
                    sendStatus(users.gbr.socket,result.err,"err");
                }
            });

            users.ger.socket.on("rematch",()=>{
                users.gbr.socket.on("rematch",()=>{
                    io.to(users.room).emit("rematchAccept");
                });
            });

            users.gbr.socket.on("rematch",()=>{
                users.ger.socket.on("rematch",()=>{
                    io.to(users.room).emit("rematchAccept");
                });
            });

            users.gbr.socket.on("disconnect",()=>{
                if(!game.getGameOver())
                    users.ger.socket.emit("victory",{victory:"GERMAN", type:"disconnect"});
            });
            users.ger.socket.on("disconnect",()=>{
                if(!game.getGameOver())
                    users.gbr.socket.emit("victory",{victory:"BRITISH", type:"disconnect"});
            });
            users.ger.socket.on("damage",()=>{
                users.ger.socket.emit("getDamage",game.attack());
            });
        }
    });
    socket.on('register', ()=>{
            console.log("SERVER ");
          socket.emit('serverValidation',res);
          res = '';
    });
    socket.on('login', ()=>{
        console.log("SERVER ");
        socket.emit('serverValidationLogin',res);
        res = '';
    });
    socket.on('resetPassword', ()=>{
        console.log("SERVER ");
        socket.emit('serverValidationResetPassword',res);
        res = '';
    });
    socket.on("cancel",(data)=>{
        for(let i=0;i<germans.length;i++)
        {
            if(germans[i].socket.id==data.id) {
                germans.splice(i,1);
            }
        }
        for(let i=0;i<britains.length;i++)
        {
            if(britains[i].socket.id==data.id) {
                britains.splice(i,1);
            }
        }
        console.log(britains);
        console.log(germans);
    })
});

server.listen(3306, ()=>{console.log("BACAAA");})

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
