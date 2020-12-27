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
    console.log(input);
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

function send() {
    let msg = document.getElementById("send").value;
    let HEADER = JSON.stringify({ type: 'chat', msg: msg });
    connection.send(HEADER);
}