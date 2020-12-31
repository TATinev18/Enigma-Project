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
    sendGameStatus("input",input);
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
    let scanning = game.useScan();
    if (scanning) {
        for (let i = 1; i < 6; i++) {
            $('#G' + i).css("fill", "yellow");
            console.log('#G' + i);
            $('#G' + i).hover(() => {
                $('#G' + i)
                    .css("fill", "red")
                    .css("cursor", "pointer");
            }, () => {
                $('#G' + i).css("fill", "yellow");
            });
        }
        $("#points").text(game.getPoints());
    }
    else {
        $('#G' + i).css("fill", "white");
        for (let i = 1; i < 6; i++) {
            $('#G' + i).css("fill", "yellow");
            console.log('#G' + i);
            $('#G' + i).hover(() => {
                $('#G' + i)
                    .css("fill", "white")
                    .css("cursor", "auto");
            }, () => {
                $('#G' + i).css("fill", "white");
            });
        }
    }
    $("#G1").click(() => {
        $("#G1").css("fill", "white").css("cursor", "auto");
    });
}

function sendGameStatus(type,data)
{
    let HEADER = JSON.stringify({
        type: type,
        data: data,
        sender: "P2"
    });
    console.log(HEADER);
    connection.send(HEADER);
}