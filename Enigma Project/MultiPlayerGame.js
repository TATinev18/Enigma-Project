let VICTORY = {
    GERMAN: 1,
    BRITISH: 2,
    NONE: 0
}

let PRICES = {
    plane: 250,
    ship: 150,
    LC: 125
}

function MultiPlayerGame() {
    var gold = 235;
    var round = 0;
    var global_nums = [];
    var history = [];
    var gameOver = false;
    var germanProvinces = [];
    var britishProvinces = [];
    var fleets = [];

    function GermanProvince(i) {
        this.id = i;
        this.hasFarm = false;
    }
    
    function BritishProvince(i) {
        this.id = i;
        this.health = 200;
    }
    
    function Fleet(i, planes, ships, LC) {
        this.id = i;
        this.planes = planes;
        this.ships = ships;
        this.landingCraft = LC;
    }

    function createFleet(p, s, lc) {
        let fleet = new Fleet(0, p, s, lc);
        fleets.push(fleet);
        return fleet;
    }

    function generateRandomNumbers() {

        let digits = [];

        for (let i = 0; i < 4; i++) {
            digits[i] = Math.floor(Math.random() * 8);
        }
        return digits;
    }

    function initMapProvinces() {
        for (let i = 0; i < 5; i++) {
            germanProvinces[i] = new GermanProvince(i);
            britishProvinces[i] = new BritishProvince(i);
        }
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

        do {
            global_nums = generateRandomNumbers();
        }
        while (checkNumbersRepeat(global_nums))
        console.log(global_nums);
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

        if (checkNumbersRepeat(input)) {
            result.err = "repeating numbers";
            return result;
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
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (userInput[i] == global_nums[j])
                    numCount++;
            }
        }
        console.log("You got " + numCount + " correct numbers");
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
        round = 0;
        global_nums = [];
        history = [];
        gameOver = false;
        germanProvinces = [];
        britishProvinces = [];
        fleets = [];
        gold=235;
    }

    function getRounds() {
        return round;
    }

    function getHistory() {
        return history;
    }

    function getGold() {
        return gold;
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
        isNumericInput,
        initMapProvinces,
        getGold,
        createFleet
    }
}

module.exports = { MultiPlayerGame, HEADER };