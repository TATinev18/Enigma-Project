// 🍝🍝🍝 WARNING SPAGHETTI CODE AHEAD 🍝🍝🍝

let game = new SinglePlayerGame(1);
game.generateGameNumbers();

function displayHistory() {
    let history = game.getHistory();
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

function reportError(error) {
    $("#error").text(error);
}

function extractNumbers() {
    let input = [];
    let num = document.getElementById("input").value;
    for (let i = 0; i < num.length; i++) {
        input[i] = parseInt(num[i]);
    }
    console.log(input);
    return input;
}

function checkVictoryConditions(input) {
    console.log(game.checkVictoryConditions(input));
    if (game.checkVictoryConditions(input)==VICTORY.BRITISH) {
        $("#over").text("win");
        $("#progressGameButton").attr("disabled",true);
    }
    if (game.checkVictoryConditions(input)==VICTORY.GERMAN) {
        $("#over").text("lose");
        $("#progressGameButton").attr("disabled",true);
    }
}

function checkGameStatus() {
    let input = extractNumbers();
    let result = game.checkUserInput(input);
    if(result.err)
    {
        reportError(result.err);
        return 0;
    }
    displayHistory();
    console.log(result);
    checkVictoryConditions(input);
    if(game.isGameOver())
    {
        game.reset();
        //clear
    }
}