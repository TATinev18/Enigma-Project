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

getGameNumbers();