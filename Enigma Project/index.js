var count=0;
var global_nums=getGameNumbers();
function getRandomNumbers() {

    let digits = [];

    for (let i = 0; i < 4; i++) {
        digits[i] = Math.floor(Math.random() * 8);
    }
    return digits;
}

function checkNumbersRepeat(digits) {

    for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 4; j++) {
            if (digits[i] == digits[j])
                return true;
        }
    }
    return false;
}

function getGameNumbers() {

    let gameDigits = [];

    do {
        gameDigits = getRandomNumbers();
    }
    while (checkNumbersRepeat(gameDigits))
    console.log(gameDigits);
    return gameDigits;
}

function countCorrectNums(userInput, code) {
    let numCount = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (userInput[i] == code[j])
                numCount++;
        }
    }
    console.log("You got " + numCount + " correct numbers");
    return numCount;
}

function countCorrectPositions(userInput, code) {
    console.log(userInput+" "+code);
    let posCount=0
    for(let i=0;i<4;i++)
        if(userInput[i]==code[i])
            posCount++;
    console.log("u got "+posCount+" correct positions")
    return posCount;
}

function extractNumbers()
{
    let input=[];
    let num=document.getElementById("input").value;
    for(let i=0;i<4;i++)
    {
        input[i]=parseInt(num[i]);
    }
    console.log(input);
    count++;
    return input;
}

function checkVictoryConditions(input)
{
    if(countCorrectPositions(input,global_nums)==4)
        $("#over").text("win");
    if(count>13)
        $("#over").text("lose");
}

function recordHistory(count,input,arr)
{
    let element='#'+(count+1).toString();
    console.log(element);
    $(element).text(
        countCorrectNums(input,arr) + 
        " " + 
        input[0] + input[1] + input[2] + input[3] +
        " " +
        countCorrectPositions(input,arr)
    );
}

function checkGameStatus()
{
    let input = extractNumbers();
    recordHistory(count,input,global_nums);
    checkVictoryConditions(input);
}

