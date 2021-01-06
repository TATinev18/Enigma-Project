let VICTORY = {
    GERMAN: 1,
    BRITISH: 2,
    NONE: 0
}

function SinglePlayerGame(level) {
    var round = 0;
    var global_nums = [];
    var history = [];
    var gameOver = false;

    function generateRandomNumbers() {

        let digits = [];

        for (let i = 0; i < 4; i++) {
            digits[i] = Math.floor(Math.random() * 8);
        }
        return digits;
    }

    function isNumericInput(input) {
        for (let i = 0; i < input.length; i++) {
            if (isNaN(input[i]))
                return false;
        }
        return true;
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

    function generateGameNumbers() {
        if (level == 1) {
            do {
                global_nums = generateRandomNumbers();
            }
            while (checkNumbersRepeat(global_nums))
            console.log(global_nums);
        } else
            global_nums = generateRandomNumbers();
        return global_nums;
    }

    function checkUserInput(input) {
        let result = {
            cNums: countCorrectNums(input),
            input: input,
            cPos: countCorrectPositions(input),
            err: "",
            round
        };

        if (level == 1) {
            if (checkNumbersRepeat(input)) {
                result.err = "repeating numbers";
                return result;
            }
        }

        if (input.length != 4) {
            result.err = "too many/little numbers";
            return result;
        }

        if (!isNumericInput(input)) {
            result.err = "invalid characters, please try numbers only";
            return result;
        }

        if (result.err == "") {
            round++;
            recordHistory(result);
            if (result.cPos == 4 || round > 13)
                gameOver = true;
        }


        return result;
    }

    function countCorrectNums(userInput) {
        let numCount = 0;
        if (level == 1) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (userInput[i] == global_nums[j])
                        numCount++;
                }
            }
            console.log("You got " + numCount + " correct numbers");
        } else {
            let globalNumsObject = {
                n0: 0,
                n1: 0,
                n2: 0,
                n3: 0,
                n4: 0,
                n5: 0,
                n6: 0,
                n7: 0,
                n8: 0,
            };
            let inputNumsObject = {
                n0: 0,
                n1: 0,
                n2: 0,
                n3: 0,
                n4: 0,
                n5: 0,
                n6: 0,
                n7: 0,
                n8: 0,
            };
            for (let i = 0; i < 4; i++) {
                console.log(global_nums[i]);
                globalNumsObject["n" + global_nums[i]]++;
            }
            for (let i = 0; i < 4; i++) {
                inputNumsObject["n" + userInput[i]]++;
            }
            for (let i = 0; i < 9; i++) {
                if ((globalNumsObject["n" + i] - inputNumsObject["n" + i]) == 0 || (globalNumsObject["n" + i] - inputNumsObject["n" + i]) > 0)
                    numCount += inputNumsObject["n" + i];
                if ((globalNumsObject["n" + i] - inputNumsObject["n" + i]) < 0)
                    numCount += globalNumsObject["n" + i];
            }
            console.log(globalNumsObject);
            console.log(inputNumsObject);
        }
        return numCount;
    }

    function countCorrectPositions(userInput) {
        let posCount = 0
        for (let i = 0; i < 4; i++)
            if (userInput[i] == global_nums[i])
                posCount++;
        console.log("u got " + posCount + " correct positions")
        return posCount;
    }

    function isGameOver() {
        return gameOver
    }

    function checkVictoryConditions(input) {
        if (countCorrectPositions(input) == 4)
            return VICTORY.BRITISH;
        if (round > 13)
            return VICTORY.GERMAN;
        return VICTORY.NONE;
    }

    function recordHistory(result) {
        history.push(result);
        return result;
    }

    function reset() {
        global_nums = [];
        history = [];
        round = 0;
        gameOver = false;
    }

    function getRounds() {
        return round;
    }

    function getHistory() {
        return history;
    }

    return {
        generateRandomNumbers,
        checkNumbersRepeat,
        generateGameNumbers,
        checkVictoryConditions,
        recordHistory,
        reset,
        getRounds,
        getHistory,
        checkUserInput,
        isGameOver,
        isNumericInput
    }
}

exports.SinglePlayerGame = SinglePlayerGame;