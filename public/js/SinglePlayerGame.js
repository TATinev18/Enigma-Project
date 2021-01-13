let VICTORY = {
    GERMAN: 1,
    BRITISH: 2,
    NONE: 0
}
/**
 * Constructor for single-player game object
 * @constructor
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @return {Object} return all the functions so they can be assigned to single-player the game object
 * */
function SinglePlayerGame() {
    var round = 0;
    var global_nums = [];
    var history = [];
    var guessedNums = [];
    var level = 1;

    /**
     *  This function generate 4 random numbers
     *
     * @author Dimitar Kalchev <dmkalchev18@codingburgas.bg>
     * @returns {number} return the 4 random numbers in array
     */
    function generateRandomNumbers() {

        let digits = [];

        for (let i = 0; i < 4; i++) {
            digits[i] = Math.floor(Math.random() * 8);
        }
        return digits;
    }
    /**
     *   Checks whether  the input of the user contains any non numeric elements
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {unknown} input input of the user
     * @returns {boolean} return true if the parameter is number, if not it return false
     */
    function isNumericInput(input) {
        for (let i = 0; i < input.length; i++) {
            if (isNaN(input[i]))
                return false;
        }
        return true;
    }
    /**
     *  Check whether numbers repeat in the array
     *
     * @author Dimitar Kalchev <dmkalchev18@codingburgas.bg>
     * @param {number[]} digits the array with numbers to be checked
     * @returns {boolean} return false if one of the values is not a number, otherwise return true
     */
    function checkNumbersRepeat(digits) {

        for (let i = 0; i < 3; i++) {
            for (let j = i + 1; j < 4; j++) {
                if (digits[i] == digits[j])
                    return true;
            }
        }
        return false;
    }
    /**
     *  Assign code to the global variable used for the code based on the level
     *
     * @author Kristian Milanov <kamilanov@codingburgas.bg>
     */
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
    /**
     *  Validate user input and if it passed all the validations add it to the history
     *
     * @author Kristian Milanov <kamilanov@codingburgas.bg>
     * @param {number[]} input user guess
     * @return {Object} return object after going through all the validations
     */
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
    /**
     *  Check how many correct numbers the user guessed
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number[]} userInput user guess
     * @return {number} the number of guessed numbers
     */
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
    /**
     *  Check how many correct position the user guessed
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number[]} userInput user guess
     * @return {number} the number of guessed positions
     */
    function countCorrectPositions(userInput) {
        let posCount = 0
        for (let i = 0; i < 4; i++)
            if (userInput[i] == global_nums[i])
                posCount++;
        return posCount;
    }
    /**
     *  Check whether there is a winner
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} input user guess
     * @return {number} return the number corresponding to the winner
     */
    function checkVictoryConditions(input) {
        if (countCorrectPositions(input) == 4)
            return VICTORY.BRITISH;
        if (round >= 13)
            return VICTORY.GERMAN;
        return VICTORY.NONE;
    }
    /**
     *  Push the result object to the history array
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {Object} result object generated by {@link checkUserInput} function
     */
    function recordHistory(result) {
        history.push(result);
    }
    /**
     *  Reset all the values so new game can be started
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     */
    function reset() {
        generateGameNumbers();
        console.log(global_nums);
        history = [];
        round = 0;
        guessedNums = [];
    }
    /**
     *  Used to get the history array
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {Object[]} return the history array
     */
    function getHistory() {
        return history;
    }
    /**
     *  Used to update the level of difficulty
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     */
    function updateLevel(lvl) {
        level = lvl;
    }
    /**
     *  Used to get the level
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {number} return the level
     */
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
