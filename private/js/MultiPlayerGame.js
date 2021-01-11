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

    function GermanProvince(i) {
        this.id = i;
        this.hasFarm = false;
    }

    function BritishProvince(i) {
        this.id = i;
        this.health = 100;
    }

    function Fleet(i, planes, ships, LC) {
        this.id = i;
        this.planes = planes;
        this.ships = ships;
        this.landingCraft = LC;
    }

    function createFleet(p, s, lc) {
        let fleet = new Fleet(fleetID, p, s, lc);
        fleets.push(fleet);
        fleetID++;
        return fleet;
    }

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

    function createFarm(province) {
        germanProvinces[province].hasFarm = true;
        goldPerTurn += 100;
    }

    function initMapProvinces() {
        for (let i = 1; i < 6; i++) {
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

        for(let i=0;i<4;i++) {
            if( input[i]<0 || input[i]>7) {
                result.err = "Number is not in range from 0 to 7";
                return result;
            }
        }

        for(let i=0;i<guessedNums.length;i++) {
            if(JSON.stringify(input)==JSON.stringify(guessedNums[i])) {
                result.err="Number has already been guessed! Try a different one!";
                return result;
            }
        }

        if (result.err == "") {
            guessedNums.push(input);
            round++;
            recordHistory(result);
            calculatePoints(result.cNums,result.cPos)
            //if (result.cPos == 4 || round > 13)
                //gameOver = true;
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
        console.log("u got " + posCount + " correct positions")
        return posCount;
    }

    function isGameOver() {
        return gameOver
    }

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

    function recordHistory(result) {
        history.push(result);
        return result;
    }

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

    function calculateGoldNewTurn() {
        gold += getGoldPerTurn();
    }

    function calculatePoints(cNums,cPos) {
        points+= cPos + (cNums-cPos)/2;
    }

    function setCode(code) {
        global_nums=code;
        return global_nums;
    }

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

    function getProvinces() {
        return {ger:germanProvinces,gbr:britishProvinces};
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

    function getPoints() {
        return points;
    }

    function getFleets() {
        return fleets;
    }

    function getChat() {
        return chat;
    }

    function recordChat(msg) {
        chat.push(msg);
    }

    function getGoldPerTurn() {
        return goldPerTurn;
    }

    function getVICTORY() {
        return VICTORY;
    }

    function updateGold(newGold) {
        gold = newGold;
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
        calculatePoints
    }
}

module.exports = { MultiPlayerGame };