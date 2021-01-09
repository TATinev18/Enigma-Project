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
    if(error=="")
        $("#error").text("");
    else
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
        $("#over").attr("src","../photos/br_victory.png");
        $("#over").css("height","400px");
        $("#progressGameButton").attr("disabled",true);
        
        if(game.getLevel()==1) {
            $("#lvl2box").css("display","block");
            game.updateLevel(2);
        } else {
            $("#winbox").css("display","block");
        }
        game.reset();
        
    }
    if (game.checkVictoryConditions(input)==VICTORY.GERMAN) {
        $("#over").attr("src","../photos/gr_victory.png");
        $("#over").css("height","400px");
        $("#progressGameButton").attr("disabled",true);
        $("#retry").css("display","block");
        game.reset();
    }
}

function resetGame() {
    game.updateLevel(1);
    game.reset();
    resetUI();
}

function resetUI() {
    $("#over").attr("src","");
    $("#history").empty();
    $("#error").text("");
    $("#lvl2box").css("display","none");
    $("#progressGameButton").attr("disabled",false);
    $("#winbox").css("display","none");
    $("#retry").css("display","none");
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

}