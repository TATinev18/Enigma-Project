let VICTORY = {
    GERMAN: 1,
    BRITISH: 2,
    NONE: 0
}

function SinglePlayerGame() {
    var round = 0;
    var global_nums = [];
    var history = [];
    var guessedNums = [];
    var level = 1;

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
        }
        if (level == 2) {
            global_nums = generateRandomNumbers();
        }
        console.log("RESULT: " + global_nums);
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

        for (let i = 0; i < 4; i++) {
            if (input[i] < 0 || input[i] > 7) {
                result.err = "Number is not in range from 0 to 7";
                return result;
            }
        }

        for (let i = 0; i < guessedNums.length; i++) {
            if (JSON.stringify(input) == JSON.stringify(guessedNums[i])) {
                result.err = "Number has already been guessed! Try a different one!";
                return result;
            }
        }

        if (result.err == "") {
            guessedNums.push(input);
            //console.log(guessedNums);
            round++;
            recordHistory(result);
        }

        return result;
    }

    function countCorrectNums(userInput) {
        let numCount = 0;
        let globalNumsObject = {
            n0: 0,
            n1: 0,
            n2: 0,
            n3: 0,
            n4: 0,
            n5: 0,
            n6: 0,
            n7: 0,
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
        };
        for (let i = 0; i < 4; i++) {
            globalNumsObject["n" + global_nums[i]]++;
            inputNumsObject["n" + userInput[i]]++;
        }
        for (let i = 0; i < 9; i++) {
            if ((globalNumsObject["n" + i] - inputNumsObject["n" + i]) == 0 || (globalNumsObject["n" + i] - inputNumsObject["n" + i]) > 0)
                numCount += inputNumsObject["n" + i];
            if ((globalNumsObject["n" + i] - inputNumsObject["n" + i]) < 0)
                numCount += globalNumsObject["n" + i];
        }
        return numCount;
    }

    function countCorrectPositions(userInput) {
        let posCount = 0
        for (let i = 0; i < 4; i++)
            if (userInput[i] == global_nums[i])
                posCount++;
        return posCount;
    }

    function checkVictoryConditions(input) {
        if (countCorrectPositions(input) == 4)
            return VICTORY.BRITISH;
        if (round >= 13)
            return VICTORY.GERMAN;
        return VICTORY.NONE;
    }

    function recordHistory(result) {
        history.push(result);
    }

    function reset() {
        generateGameNumbers();
        console.log(global_nums);
        history = [];
        round = 0;
        guessedNums = [];
    }

    function getHistory() {
        return history;
    }

    function updateLevel(lvl) {
        level = lvl;
    }

    function getLevel() {
        return level;
    }

    return {
        checkNumbersRepeat,
        checkUserInput,
        checkVictoryConditions,
        generateGameNumbers,
        generateRandomNumbers,
        getHistory,
        getLevel,
        isNumericInput,
        recordHistory,
        reset,
        updateLevel,
    }
}

exports.SinglePlayerGame = SinglePlayerGame;