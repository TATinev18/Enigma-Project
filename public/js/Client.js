//const { Socket } = require("socket.io");
const { Socket } = require("socket.io");
/**
 * Display history to the html with the corresponding data from the array
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {Object[]} history the history array
 */
function displayHistory(history) {
    console.log(history);
    let str = '';
    for (i in history) {
        str += '<div class="row" style=";top: 22%;left: 36%;"><div class="col-sm guess1" >' +
            printSquares(history[i].cPos) + '</div><div class="col-sm guess2">' +
            history[i].input[0] + history[i].input[1] + history[i].input[2] +
            history[i].input[3] + '</div><div class="col-sm guess3">' +
            printSquares(history[i].cNums - history[i].cPos) +
            '</div></div>';
        console.log(str);
    }
    $("#history").html(str);
}
/**
 * Print squares based on the parameter
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {numbers} correctSquareCount the amount of correct squares
 * @return {string} the square printed
 */
function printSquares(correctSquareCount) {
    let res = "";
    for (let i = 0; i < correctSquareCount; i++) {
        res += "🟩";
    }
    for (let i = 0; i < 4 - correctSquareCount; i++) {
        res += "🟥";
    }
    return res;
}
/**
 * Get the input from the user and put in array that is returned
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @return {number[]} the array with the number from the user
 */
function extractNumbers() {
    let input = [];
    let num = document.getElementById("input").value;
    for (let i = 0; i < num.length; i++) {
        input[i] = parseInt(num[i]);
    }
    document.getElementById("input").value = "";
    return input;
}
/**
 * Deselect scanning for farm
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function deselectScan() {
    console.log("aaa");
    $("#scan").text("Scan province for farm ( -10P )");
    $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
    $("#scan").data('clicked', false);
}
/**
 * Destroy farm if found on the selected province
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function scan() {
    $("#scan").text("Cancel Scan");
    $("#scan").data('clicked', true);
    $("#G1, #G2, #G3, #G4, #G5").css("fill", "yellow");
    for (let i = 1; i < 6; i++) {
        $("#G" + i).on({
            mouseenter: function() {
                $("#G" + i).css("fill", "white").css("cursor", "pointer");
            },
            mouseleave: function() {
                $("#G" + i).css("fill", "yellow").css("cursor", "auto");
            },
            click: function() {
                $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
                console.log(i);
                socket.emit("scan", i);
                deselectScan();
                updateCurrency();
            }
        });
    }
}
/**
 * Cancel the creating of farm
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function deselectFarm() {
    console.log("aaa");
    $("#createFarm").text("Create Farm ( 200 G )");
    $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
    $("#createFarm").data('clicked', false);
}
/**
 * Get the all the data for all provinces
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function requestProvinces() {
    let dataObj = {};
    socket.emit("getProvinces");
    socket.on("receiveProvinces", async(data) => {
        dataObj = await data;
    });
    return dataObj;
}
/**
 * Display whether or not province has farm already on it
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {Object} provinces all the provinces on the map
 */
function displayUsedProvinces(provinces) {
    console.log(provinces);
    for (let i = 1; i < 6; i++) {
        if (provinces.ger[i].hasFarm)
            $("#G" + i).css("fill", "yellow");
    }
}
/**
 * Start the process of creating a farm by showing you all the available places for farm
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function createFarm() {
    $("#createFarm").text("Cancel Farm");
    $('#createFarm').data('clicked', true);
    $("#G1, #G2, #G3, #G4, #G5").css("fill", "green");
    let a = requestProvinces();
    console.log(a);

    for (let i = 1; i < 6; i++) {
        $("#G" + i).on({
            mouseenter: function() {
                $("#G" + i).css("fill", "white").css("cursor", "pointer");
            },
            mouseleave: function() {
                $("#G" + i).css("fill", "green").css("cursor", "auto");
            },
            click: function() {
                $("#G1, #G2, #G3, #G4, #G5").off().css("fill", "white").css("cursor", "auto");
                console.log(i);
                socket.emit("createFarm", i);
                updateCurrency();
                $("#createFarm").text("Create Farm ( 200 G )");
            }
        });
    }
}

/**
 * Show and hide content base on your side
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {string} side the side of the player
 */
function hideElements(side) {
    if (side == "British") {
        $("#fleet").css("display", "none");
        $("#createFleet").css("display", "none");
        $("#setCode").css("display", "none");
        $("#damage").css("display", "none");
        $("#GPT").css("display", "none");
    }
    if (side == "German") {
        $("#scan").css("display", "none");
        $("#guess").css("display", "none");

    }
}
/**
 * Lock fleet menu base on the value of the parameter given
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {number} lock
 */
function lockFleetMenu(lock) {
    if (lock == 1) {
        $("#fleet").children().attr("disabled", true);
        $("#fleet").children().children().attr("disabled", true);
    }
    if (lock == 2) {
        $("#fleet").children().children().attr("disabled", false);
        $("#fleet").children().attr("disabled", false);
    }
}
/**
 * Tell the server to send the currency to the client
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function updateCurrency() {
    socket.emit("getCurrency");
}
/**
 * Send the server code for the game
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function setCode() {
    let code = extractNumbers();
    console.log(code);
    socket.emit("getCode", code);
}
/**
 * Make the game possible by establishing socket connection between the client and the serve
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {number} rank In progress
 */
function findMatch(rank) {
    let user = document.getElementById("user").value;

    let data = {
        side: side.value,
        matchType: rank,
        user: user
    };

    //socket = io('http://' + IP_ADDRESS + ':' + PORT);
    socket = io('http://localhost:8080');
    socket.emit("matchMake", data);

    socket.on("begin", () => {
        console.log("beggining");
        $('#search').css('display', 'none');
        $('#game').css('display', 'block');
        $("#fleet").css("display", "block");
        $("#error").css("display", "block").css("background-color", "rgb(110, 185, 60)");
        if (side.value == "British")
            $("#error").text("Waiting for " + user + " to enter a number!");
        if (side.value == "German")
            $("#error").text("Please input your code in the input box.");

        socket.emit("side", side.value);
        hideElements(side.value);
        updateCurrency();
    });

    socket.on("chat", (data) => {
        let chatColor;
        if (data.side == "German") {
            chatColor = "style='color:red'";
        } else {
            chatColor = "style='color:blue'";
        }
        $('#chatbox').html($('#chatbox').html() + '<p><span ' + chatColor + '">' + data.user + ': </span><span class="txt" style="color:white">' + data.msg + '</span></p>');
    });

    socket.on("beginTurn", () => {
        beginTurn();
        updateCurrency();
    });

    socket.on("endTurn", () => {
        endTurn();
        updateCurrency();
    });

    socket.on("round", (round) => {
        $("#rounds").text("Round: " + round);
    })

    socket.on("fleetResult", (msg) => {
        console.log(msg);
        updateCurrency();
    });

    socket.on("getDamage", (damage) => {
        $("#damage").text("Total fleet damage: " + damage);
    });

    socket.on("scanResult", (msg) => {
        console.log(msg);
        updateCurrency();
    });

    socket.on("farmResult", (msg) => {
        console.log(msg);
    });
    socket.on("updateCurrency", (currency) => {
        if (data.side == "British")
            $("#currency").text("Points: " + currency);
        if (data.side == "German") {
            $("#currency").text("Gold: " + currency.gold);
            $("#GPT").text("Gold per turn: " + currency.GPT);
        }
    });
    socket.on("forceTurn", () => {
        $("#ET").attr("disabled", true);
    });

    socket.on("statusReport", (data) => {
        console.log("aaaa");
        $("#error").text(data.status);
        if (data.type == "succ")
            $("#error").css("background-color", "rgb(110, 185, 60)");
        if (data.type == "warn")
            $("#error").css("background-color", "rgb(190, 129, 36)");
        if (data.type == "err")
            $("#error").css("background-color", "rgb(163, 33, 33)");
    });
    socket.on("approveCode", () => {
        $("#error").text("Code successfully sent!").css("background-color", "rgb(110, 185, 60)");;
        $("#setCode").css("display", "none");
        $("#input").css("display", "none");
        $("#ET").attr("disabled", false);
    })
    socket.on("history", (history) => {
        $("#error").text("Your Turn");
        $("#input").attr("disabled", true);
        $("#guess").attr("disabled", true);
        displayHistory(history);
        updateCurrency();
    });
    //socket.on("receiveProvinces",(provinces)=>{
    //    displayUsedProvinces(provinces);
    //})
    socket.on("victory", (data) => {
        console.log(data);
        if (data.victory == "GERMAN") {
            $("#victory").attr("src", "../photos/gr_victory.png");
            $("#victory").css("height", "auto").addClass("fade-in-down");
            $("#heading").css("display", "none");
            $("#history").css("display", "none");
            $("#mapANDbtn").css("display", "none");
            $("#error").css("display", "none");
            $("#buttonsMenu").css("display", "none");
            $("#historyTable").css("display", "none");
        }
        if (data.victory == "BRITISH") {
            $("#victory").attr("src", "../photos/br_victory.png");
            $("#victory").css("width", "inherit").css("height", "auto").addClass("fade-in-down");
            $("#heading").css("display", "none");
            $("#history").css("display", "none");
            $("#mapANDbtn").css("display", "none");
            $("#error").css("display", "none");
            $("#buttonsMenu").css("display", "none");
            $("#historyTable").css("display", "none");
        }
        $("#input").attr("disabled", true);
        $("#guess").attr("disabled", true);
        $("#ET").attr("disabled", true);
        $("#scan").attr("disabled", true);
    });
}
/**
 * Send the chat object to the server
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {string} msg message to be sent
 */
function chat(msg) {
    if (!$("#send").val().length == 0) {
        console.log(socket);
        console.log(msg);
        $("#send").val("");
        socket.emit("chat", { msg: msg, side: side.value });
    }
}
/**
 * Send user guess to the server
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function guess() {
    let nums = extractNumbers();
    $("#ET").attr("disabled", false);
    socket.emit("guess", nums);
}
/**
 * Ending the turn and sending it to the server
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function endTurn() {
    $("#input").attr("disabled", true);
    $("#guess").attr("disabled", true);
    $("#ET").attr("disabled", true);
    $("#scan").attr("disabled", true);
    $("#createFarm").data("clicked", false);
    $("#scan").data("clicked", false);
    $("#error").text("Waiting for " + user + " to end their turn...").css("background-color", "rgb(110, 185, 60)");
    deselectFarm();
    deselectScan();
    lockFleetMenu(1);
    resetFleetMenu();
    socket.emit("endTurn");
}
/**
 * Begin the new turn
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function beginTurn() {
    $("#sendFleet").attr("disabled", true);
    $("#input").attr("disabled", false);
    $("#guess").attr("disabled", false);
    if (side.value == "German")
        $("#ET").attr("disabled", false);
    $("#scan").attr("disabled", false);
    $("#error").text("Your Turn").css("background-color", "rgb(110, 185, 60)");
    lockFleetMenu(2);
    resetFleetMenu();
}
/**
 * Prepare all the fleet and send it to the server
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function sendFleet() {
    let fleet = {
        plane: $("#planeDisplay").text(),
        ship: $("#shipDisplay").text(),
        LC: $("#LCDisplay").text(),
        farm: $("#farmDisplay").text(),
        price: $("#total").text()
    };
    resetFleetMenu();
    console.log("emit");
    socket.emit("fleet", fleet);
    socket.emit("damage");
}
/**
 * Reset the fleet menu
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 */
function resetFleetMenu() {
    $("#planeCost,#shipCost,#LCCost,#planeDisplay,#shipDisplay,#LCDisplay,#total").text("0");
    $("#sendFleet").attr("disabled", true);
}
/**
 * Front-end function for selecting side
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {Object} element the side chosen by the user
 */
function enableClick(element) {
    $("#unrankedButton").attr("disabled", false);
    $("#rankedButton").attr("disabled", false);
    element.off("mouseenter").off("mouseleave").css("cursor", "auto").css("transform", "scale(1.05)")
    if (element == gs)
        element.css("box-shadow", "0 4px 8px 0 rgb(163, 33, 33), 0 6px 20px 0 rgb(163, 33, 33)");
    else
        element.css("box-shadow", "0 4px 8px 0 rgb(32, 80, 184), 0 6px 20px 0 rgb(32, 80, 184)");
}
/**
 * Front-end function for selecting side
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {Object} element the side chosen by the user
 */
function enableHover(element) {
    element.css("transform", "scale(1)")
        .css("box-shadow", "0 4px 8px 0 rgb(0, 0, 0), 0 6px 20px 0 rgb(0, 0, 0)")
        .on({
            mouseenter: () => {
                element.css("transform", "scale(1.05)").css("cursor", "pointer");
                if (element == gs)
                    element.css("box-shadow", "0 4px 8px 0 rgb(163, 33, 33), 0 6px 20px 0 rgb(163, 33, 33)");
                else
                    element.css("box-shadow", "0 4px 8px 0 rgb(32, 80, 184), 0 6px 20px 0 rgb(32, 80, 184)");
            },
            mouseleave: () => {
                element.css("transform", "scale(1)")
                    .css("box-shadow", "0 4px 8px 0 rgb(0, 0, 0), 0 6px 20px 0 rgb(0, 0, 0)")
                    .css("cursor", "auto");
            }
        });
}
/**
 * Change the utility values
 *
 * @author Kristian Milanov <kamilanov18@codingburgas.bg>
 * @param {number} id id of the value
 * @param {number} priceId id of the price
 * @param {string} operation is adding or subtracting
 * @param {number} priceUnit price per unit
 */
function changeUtilityValues(id, priceId, operation, priceUnit) {
    let value = parseInt(document.getElementById(id).innerHTML);
    let price = parseInt(document.getElementById(priceId).innerHTML);
    if (operation == "+") {
        document.getElementById(id).innerHTML = value + 1;
        document.getElementById(priceId).innerHTML = priceUnit * (value + 1);
    } else {
        if (value - 1 >= 0) {
            document.getElementById(id).innerHTML = value - 1;
            document.getElementById(priceId).innerHTML = priceUnit * (value - 1);
        }
    }
    let planeCost = parseInt(document.getElementById("planeCost").innerHTML);
    let shipCost = parseInt(document.getElementById("shipCost").innerHTML);
    let LCCost = parseInt(document.getElementById("LCCost").innerHTML);
    let total = planeCost + shipCost + LCCost;
    document.getElementById("total").innerHTML = (total);
    if (total > 0) $("#sendFleet").attr("disabled", false);
    else $("#sendFleet").attr("disabled", true);
}
