/**
 * Constructor for the multiplayer game object
 * @constructor
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @return {Object} return all the functions so they can be assigned to the multiplayer game object
 * */
function MultiPlayerGame() {
    var gold = 275;
    var goldPerTurn = 0;
    var round = 0;
    var global_nums = [];
    var history = [];
    var gameOver = false;
    var germanProvinces = [];
    var britishProvinces = [];
    var fleets = [];
    var chat = [];
    var points = 0;
    var fleetID = 0;
    var level=0;
    var guessedNums=[];

    const VICTORY = {
        GERMAN: 1,
        BRITISH: 2,
        NONE: 0
    }

    let DAMAGE = {
        plane: 5,
        ship: 7,
        LC: 2
    }

    let PRICES = {
        plane: 250,
        ship: 150,
        LC: 125,
        defence: 100,
        farm: 200,
        scanner: 10
    }
    /**
     * Constructor for german province object
     * @constructor
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} i the id of the province created
     * */
    function GermanProvince(i) {
        this.id = i;
        this.hasFarm = false;
    }
    /**
     * Constructor for british province object
     * @constructor
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} i the id of the province created
     * */
    function BritishProvince(i) {
        this.id = i;
        this.health = 100;
    }
    /**
     * Constructor for the fleet object
     * @constructor
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} i the id of the fleet created
     * @param {number} planes the amount of planes made
     * @param {number} ships the amount of ships made
     * @param {number} LC the amount of landing crafts made
     * */
    function Fleet(i, planes, ships, LC) {
        this.id = i;
        this.planes = planes;
        this.ships = ships;
        this.landingCraft = LC;
    }
    /**
     * Create fleet obj and push it in the fleets array
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} p the amount of planes given for the fleet
     * @param {number} s the amount of ships given for the fleet
     * @param {number} lc the amount of landing crafts given for the fleet
     * @return {Object} the new fleet created with the parameters
     * */
    function createFleet(p, s, lc) {
        let fleet = new Fleet(fleetID, p, s, lc);
        fleets.push(fleet);
        fleetID++;
        return fleet;
    }
    /**
     * Calculate the damage the fleet can do
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>

     * @return {number} the damage of the fleet
     * */
    function attack() {
        let damage = 0;
        for (let i = 0; i < fleets.length; i++) {
            damage += parseInt(fleets[i].planes) * DAMAGE.plane
                + parseInt(fleets[i].ships) * DAMAGE.ship
                + parseInt(fleets[i].landingCraft) * DAMAGE.LC;
        }
        console.log("damage:" +damage);
        return damage;
    }
    /**
     * Create farm which will produce gold over time
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} province the id of the province in which the farm is going to be created
     * */
    function createFarm(province) {
        germanProvinces[province].hasFarm = true;
        goldPerTurn += 100;
    }
    /**
     * Create six of both the german and british provinces
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     *
     * */
    function initMapProvinces() {
        for (let i = 1; i < 6; i++) {
            germanProvinces[i] = new GermanProvince(i);
            britishProvinces[i] = new BritishProvince(i);
        }
    }
    /**
     * Check if all the values in the array are numbers
     *
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {unknown} input the array with values to be checked
     * @return {boolean} return false if one of the values is not a number, otherwise return true
     * */
    function isNumericInput(input) {
        for (let i = 0; i < input.length; i++) {
            if (isNaN(input[i]))
                return false;
        }
        return true;
    }
    /**
     * Check whether numbers repeat in the array
     *
     *
     * @author @author Dimitar Kalchev <dmkalchev18@codingburgas.bg>
     * @param {unknown} digits the array with numbers to be checked
     * @return {boolean} return false if one of the values is not a number, otherwise return true
     * */
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

        if (input.length != 4) {
            result.err = " too many/little numbers";
            return result;
        }

        if (!isNumericInput(input)) {
            result.err = " invalid characters, please try numbers only";
            return result;
        }

        if (checkNumbersRepeat(input)) {
            result.err = " repeating numbers";
            return result;
        }

        for(let i=0;i<4;i++) {
            if( input[i]<0 || input[i]>7) {
                result.err = " Number is not in range from 0 to 7";
                return result;
            }
        }

        for(let i=0;i<guessedNums.length;i++) {
            if(JSON.stringify(input)==JSON.stringify(guessedNums[i])) {
                result.err=" Number has already been guessed! Try a different one!";
                return result;
            }
        }

        if (result.err == "") {
            guessedNums.push(input);
            round++;
            recordHistory(result);
            calculatePoints(result.cNums,result.cPos)
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
        console.log("u got " + posCount + " correct positions")
        return posCount;
    }
    /**
     * Used to get the value for the end of the game
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {boolean} return the variable for the end of the game
     */
    function isGameOver() {
        return gameOver
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
        if (round >= 13) {
            if(attack()>=100)
                return VICTORY.GERMAN;
            else
                return VICTORY.BRITISH;
        }

        return VICTORY.NONE;
    }
    /**
     *  Push the result object to the history array
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {Object} result object generated by {@link checkUserInput} function
     * @return return the object given as a parameter
     */
    function recordHistory(result) {
        history.push(result);
        return result;
    }
    /**
     *  Check if there is a farm in given province, if there is one it's destroyed and the player loses all the benefits he gained from it
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} input user guess
     * @return {number} return the number corresponding to the winner
     */
    function useScan(province) {
        console.log(germanProvinces);
        console.log(province);
        if (germanProvinces[province].hasFarm) {
            points = points - 10;
            goldPerTurn-=100;
            germanProvinces[province].hasFarm = false;
            return true
        }
        return false;
    }
    /**
     *  Earn the gold for the turn
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     */
    function calculateGoldNewTurn() {
        gold += getGoldPerTurn();
    }
    /**
     *  Earn the points base on how good was the guess
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} cNums points for the guessed numbers
     * @param {number} cPos points for the guessed positions
     */
    function calculatePoints(cNums,cPos) {
        points+= cPos + (cNums-cPos)/2;
    }
    /**
     *  Set the global variable for the code to the code given
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} code the code given by the german
     * @return {number} return the code
     */
    function setCode(code) {
        global_nums=code;
        return global_nums;
    }
    /**
     *  Reset all the values so new game can be started
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     */
    function reset() {
        round = 0;
        global_nums = [];
        history = [];
        gameOver = false;
        germanProvinces = [];
        britishProvinces = [];
        fleets = [];
        gold = 235;
        points = 0;
        goldPerTurn = 0;
        guessedNums=[];
    }
    /**
     *  Reset all the values so new game can be started
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {Object[]}
     */
    function getProvinces() {
        return {ger:germanProvinces,gbr:britishProvinces};
    }
    /**
     *  Used to get the round
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {number} return the value of the round variable
     */
    function getRounds() {
        return round;
    }
    /**
     *  Used to get the history
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {Object[]} return the history array
     */
    function getHistory() {
        return history;
    }
    /**
     *  Used to get the gold
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {number} return the gold
     */
    function getGold() {
        return gold;
    }
    /**
     *  Used to get the points
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {number} return the points
     */
    function getPoints() {
        return points;
    }
    /**
     *  Used to get the fleets
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {Object[]} return the fleets
     */
    function getFleets() {
        return fleets;
    }
    /**
     *  Used to get the chat array with objects
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {Object[]} return the chat array
     */
    function getChat() {
        return chat;
    }
    /**
     *  Push the given object to the chat array
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {Object} msg object with the user and the message
     */
    function recordChat(msg) {
        chat.push(msg);
    }
    /**
     *  Used to get the gold per turn
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {number} return the gold per turn
     */
    function getGoldPerTurn() {
        return goldPerTurn;
    }
    /**
     *  Used to get the victory
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @return {Object} return the object with the winner
     */
    function getVICTORY() {
        return VICTORY;
    }
    /**
     *  Update the gold with the new gold
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {number} newGold new gold
     */
    function updateGold(newGold) {
        gold = newGold;
    }

    /**
     *  Clear the history and guessedNums array, used for checking the input of the german player's entered code
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     *
     */
    function clearHistoryAndGuessedNums() {
        history=[];
        guessedNums=[];
    }

    /**
     *  Return the value of gameOver
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * 
     */
    function getGameOver() {
        return gameOver;
    }

    /**
     *  Update the state of the gameOver variable
     *
     * @author Kristian Milanov <kamilanov18@codingburgas.bg>
     * @param {boolean} state the new state of the variable
     */
    function updateGameOver(state) {
        gameOver=state;
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
        createFleet,
        getPoints,
        getFleets,
        useScan,
        getChat,
        recordChat,
        getGoldPerTurn,
        createFarm,
        getVICTORY,
        attack,
        calculateGoldNewTurn,
        updateGold,
        getProvinces,
        setCode,
        calculatePoints,
        clearHistoryAndGuessedNums,
        getGameOver,
        updateGameOver,
        getLevel,
        updateLevel
    }
}

module.exports = { MultiPlayerGame };
