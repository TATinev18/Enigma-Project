let game = new SinglePlayerGame();
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
    console.log(input);
    return input;
}

function checkVictoryConditions(input) {
    if (game.checkVictoryConditions(input)==VICTORY.BRITISH)
        $("#over").text("win");
    if (game.checkVictoryConditions(input)==VICTORY.GERMAN)
        $("#over").text("lose");
}

function checkGameStatus() {
    let input = extractNumbers();
    let result = game.checkUserInput(input);
    if(result.err)
    {
        console.log(result.err);
        return 0;
    }
    displayHistory();
    console.log(result);
    checkVictoryConditions(result);
    if(game.isGameOver())
    {
        game.reset();
        //clear
    }
}