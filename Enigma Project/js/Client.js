//const { Socket } = require("socket.io");
const { Socket } = require("socket.io");

let game = new MultiPlayerGame();

function displayHistory(history) {
    console.log(history);
    let str='';
    for (i in history) {
        str+='<div class="row" style=";top: 22%;left: 36%;"><div class="col-sm" style="background-color: burlywood;">'+printSquares(history[i].cNums)+'</div><div class="col-sm" style="background-color: cornflowerblue;"><span id="">'+history[i].input[0] + history[i].input[1] + history[i].input[2] + history[i].input[3]+'</span></div><div class="col-sm" style="background-color: darkkhaki;">'+printSquares(history[i].cPos)+'</div></div>';
        //str+="</div>";
        console.log(str);
    }
    $("#history").html(str);
}

function printSquares(correctSquareCount) {
    let res="";
    for(let i=0;i<correctSquareCount;i++) {
        res+="🟩";
    }
    for(let i=0;i<4-correctSquareCount;i++) {
        res+="🟥";
    }
    return res;
}

function extractNumbers() {
    let input = [];
    let num = document.getElementById("input").value;
    for (let i = 0; i < num.length; i++) {
        input[i] = parseInt(num[i]);
    }
    document.getElementById("input").value = "";
    return input;
}

function checkVictoryConditions(input) {
    if (game.checkVictoryConditions(input) == game.VICTORY.BRITISH)
        $("#over").text("win");
    if (game.checkVictoryConditions(input) == game.VICTORY.GERMAN)
        $("#over").text("lose");
}

function deselectScan() {
    console.log("aaa");
    $("#scan").text("Scan province for farm ( -10P )");
    $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
    $("#scan").data('clicked', false);
}

function scan() {
    $("#scan").text("Cancel Scan");
    $("#scan").data('clicked', true);
    $("#G1, #G2, #G3, #G4, #G5").css("fill", "yellow");
    for (let i = 1; i < 6; i++) {
        $("#G" + i).on({
            mouseenter: function () {
                $("#G" + i).css("fill", "white").css("cursor", "pointer");
            },
            mouseleave: function () {
                $("#G" + i).css("fill", "yellow").css("cursor", "auto");
            },
            click: function () {
                $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
                console.log(i);
                socket.emit("scan",i);
                deselectScan();
                updateCurrency();
            }
        });
    }
}

function deselectFarm() {
    console.log("aaa");
    $("#createFarm").text("Create Farm ( 200 G )");
    $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
    $("#createFarm").data('clicked', false);
}

function requestProvinces() {
    let dataObj={};
    socket.emit("getProvinces");
    socket.on("receiveProvinces", async (data)=>{
        dataObj=await data;
    });
    return dataObj;
}

function displayUsedProvinces(provinces) {
    console.log(provinces);
    for(let i=1;i<6;i++) {
        if(provinces.ger[i].hasFarm)
            $("#G"+i).css("fill","yellow");
    }
}

function createFarm() { 
    $("#createFarm").text("Cancel Farm");
    $('#createFarm').data('clicked', true);
    $("#G1, #G2, #G3, #G4, #G5").css("fill", "green");
    let a = requestProvinces();
console.log(a);
    
    for (let i = 1; i < 6; i++) {
        $("#G" + i).on({
            mouseenter: function () {
                $("#G" + i).css("fill", "white").css("cursor", "pointer");
            },
            mouseleave: function () {
                $("#G" + i).css("fill", "green").css("cursor", "auto");
            },
            click: function () {
                $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
                console.log(i);
                socket.emit("createFarm",i);
                updateCurrency();
                $("#createFarm").text("Create Farm ( 200 G )");
            }
        });
    }
}


function hideElements(side) {
    if(side=="British") {
        $("#fleet").css("display","none");
        $("#createFleet").css("display","none");
        $("#setCode").css("display","none");
    }
    if(side=="German") {
        $("#scan").css("display","none");
        $("#guess").css("display","none");

    }
}

function lockFleetMenu(lock) {
    if(lock==1) {
        $("#fleet").children().attr("disabled",true);
        $("#fleet").children().children().attr("disabled",true);
    }
    if(lock==2) {
        $("#fleet").children().children().attr("disabled",false);
        $("#fleet").children().attr("disabled",false);
    }
}

function updateCurrency() {
    socket.emit("getCurrency");
}

function setCode() {
    let code = extractNumbers();
    console.log(code);
    socket.emit("getCode",code);
    $("#setCode").css("display","none");
    $("#input").css("display","none");
    $("#ET").attr("disabled",false);
}

