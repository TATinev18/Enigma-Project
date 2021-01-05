//const { Socket } = require("socket.io");

const { Socket } = require("socket.io");

let game = new MultiPlayerGame();
game.generateGameNumbers();

function displayHistory() {
    let history = game.getHistory();
    console.log(history);
    for (i in history) {
        let element = '#' + (history[i].round + 1).toString();
        $(element).text(
            history[i].cNums +
            " " +
            history[i].input[0] + history[i].input[1] + history[i].input[2] + history[i].input[3] +
            " " +
            history[i].cPos
        );
    }
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

function checkGameStatus() {
    let input = extractNumbers();
    $("#points").text(game.getPoints());
    let result = game.checkUserInput(input);
    if (result.err) {
        console.log(result.err);
        return 0;
    }
    displayHistory();
    checkVictoryConditions(result);
    if (game.isGameOver()) {
        game.reset();
        //clear
    }
}

function scan() {
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
                updateCurrency();
            }
        });
    }
}

function createFarm() {
    $("#G1, #G2, #G3, #G4, #G5").css("fill", "green");
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
            }
        });
    }
}

function hideElements(side) {
    if(side=="British") {
        $("#fleet").css("display","none");
        $("#createFleet").css("display","none");
    }
    if(side=="German") {
        $("#scan").css("display","none");
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

