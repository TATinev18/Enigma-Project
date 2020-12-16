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
}

function countCorrectNums(userInput, code) {
    let count = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (userInput[i] == code[j])
                count++;
        }
    }
    console.log("You got " + count + " correct numbers");
    return count;
}

function countCorrectPositions(userInput, code) {
    let count = 0;
    for (let i = 0; i < 4; i++)
        if (userInput[i] == code[i])
            count++;
    console.log("You got " + count + " correct positions");
    return count;
}

function startGame() {
    let arr = [1, 2, 3, 4], nums = [1, 2, 4, 3];
    countCorrectPositions(nums, arr);
    countCorrectNums(nums, arr);
}

/*
function extractNumbers()
{
    let arr=[];
    num=document.getElementById("textfield").value;
    for(let i=0;i<4;i++)
    {
        arr[i]=parseInt(num[i]);
    }
    return arr;
}
*/

startGame();