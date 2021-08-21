/* Get the element you want displayed in fullscreen */
var elem = document.body;

/* Function to open fullscreen mode */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
}

String.prototype.replaceAt = function (index, replacement) {
    return (
        this.substr(0, index) +
        replacement +
        this.substr(index + replacement.length)
    );
};

class PlayerName {
    static namelength = 3;
    constructor(id) {
        this.id = id;
        this.name = "---";
        this.length = 0;
    }

    add(letter) {
        if (this.length == 0) {
            document.getElementsByClassName("player-name")[
                this.id
            ].disabled = false;
        }
        if (this.length < PlayerName.namelength) {
            this.name = this.name.replaceAt(this.length, letter);
            this.length++;
            this.update();
            if (this.length != PlayerName.namelength) {
                document.getElementsByClassName(
                    "next-player-btn"
                )[0].disabled = true;
            }
            if (
                this.id >= PlayerNames.minPlayers - 1 &&
                this.length == PlayerName.namelength
            ) {
                document.getElementsByClassName(
                    "next-player-btn"
                )[0].disabled = false;
            }
            // display max 7 players box instead of disabling!
            if (
                this.id == PlayerNames.maxPlayers - 1 &&
                this.length == PlayerName.namelength
            ) {
                let letters = document
                    .getElementById("keyboard")
                    .getElementsByClassName("letter");
                for (let letter of letters) {
                    letter.disabled = true;
                }
            }
            return true;
        }
        return false;
    }

    remove() {
        let letters = document
            .getElementById("keyboard")
            .getElementsByClassName("letter");
        for (let letter of letters) {
            letter.disabled = false;
        }

        if (this.length > 0) {
            this.name = this.name.replaceAt(this.length - 1, "-");
            this.length--;
            this.update();
            if (this.id <= PlayerNames.minPlayers - 1) {
                document.getElementsByClassName(
                    "next-player-btn"
                )[0].disabled = true;
            } else {
                document.getElementsByClassName("next-player-btn")[0].disabled =
                    this.length != 0;
            }

            if (this.length == 0) {
                document.getElementsByClassName("player-name")[
                    this.id
                ].disabled = true;
            } else {
                return true;
            }
            return false;
        }
        if (this.id > 0) {
            document.getElementsByClassName(
                "next-player-btn"
            )[0].disabled = false;
        }
        return false;
    }

    update() {
        document.getElementsByClassName("player-name")[this.id].innerHTML =
            this.name;
    }
}

class PlayerNames {
    static minPlayers = 3;
    static maxPlayers = 7;
    constructor() {
        this.names = Array();
    }

    movePlayer(id) {
        let name = this.names[id].name;
        let id2 = id - 1;
        this.names[id].name = this.names[id2].name;
        this.names[id2].name = name;
        this.names[id].update();
        this.names[id2].update();
    }

    pushLetter(letter) {
        if (this.numPlayers == 0) {
            this.newPlayer();
            this.addLetter(letter);
            document.getElementsByClassName(
                "delete-player-btn"
            )[0].disabled = false;
        } else {
            if (!this.addLetter(letter)) {
                this.newPlayer();
                this.addLetter(letter);
            }
        }

        // console.log(this.names);
    }

    deleteLetter() {
        if (!this.names[this.numPlayers - 1].remove()) {
            if (this.numPlayers == 1) {
                document.getElementsByClassName(
                    "delete-player-btn"
                )[0].disabled = true;
                this.names = Array();
            } else {
                this.names = this.names.slice(0, this.numPlayers - 1);
                if (this.numPlayers >= PlayerNames.minPlayers) {
                    document
                        .getElementsByClassName("player-name")
                        [this.numPlayers].classList.add("hide");
                }
            }
        }
    }

    get numPlayers() {
        return this.names.length;
    }

    newPlayer() {
        if (this.numPlayers < PlayerNames.maxPlayers) {
            if (this.numPlayers >= PlayerNames.minPlayers - 1) {
                document
                    .getElementsByClassName("player-name")
                    [this.numPlayers].classList.remove("hide");
            }
            this.names.push(new PlayerName(this.numPlayers));
        }
    }

    addLetter(letter) {
        return this.names[this.numPlayers - 1].add(letter);
    }
}

function toggleKeyboard() {
    let i = 0;
    let keyboard = undefined;
    if (
        document.getElementById("keyboard").getElementsByClassName("abc")
            .length == 0
    ) {
        i = 13;
        let btn = document
            .getElementById("keyboard")
            .getElementsByClassName("toggle")[0];
        btn.classList.add("abc");
        btn.innerHTML = "ABC";
    } else {
        let btn = document
            .getElementById("keyboard")
            .getElementsByClassName("toggle")[0];
        btn.classList.remove("abc");
        btn.innerHTML = "XYZ";
    }

    let letters = document
        .getElementById("keyboard")
        .getElementsByClassName("letter");

    for (letter of letters) {
        let char = String.fromCharCode(65 + i);
        letter.innerHTML = char;
        letter.setAttribute("onClick", `playerNames.pushLetter('${char}');`);
        i++;
    }
    // document.getElementById("keyboard").classList.remove("hide");
    // document.getElementById("abc-keyboard").classList.add("hide");
}

function createKeyboard() {
    let keyboard = document.getElementById("keyboard");
    let toggleBtn = keyboard.getElementsByClassName("toggle");
    for (let i = 12; i >= 0; i--) {
        let char = String.fromCharCode(65 + i);
        button = document.createElement("button");
        button.setAttribute("onClick", `playerNames.pushLetter('${char}');`);
        button.classList.add("btn-item", "letter");
        button.innerHTML = `${char}`;
        keyboard.insertBefore(button, keyboard.childNodes[0]);
    }
}

function switchScreen(to, from) {
    document.getElementById(to).classList.remove("hide");
    document.getElementById(from).classList.add("hide");
    if (to == "rounds") {
        toNumRoundsScreen();
    }
}

function setNumRounds(rounds) {
    // console.log("rounds: ", rounds);

    scoreboard.setNumPlayers(playerNames.numPlayers);
    scoreboard.setNumRounds(rounds);

    switchScreen("new-round", "rounds");
}

function setPlayerScore(score) {
    let scoresheet = document
        .getElementById("new-round")
        .getElementsByClassName("player-area")[0];

    scoresheet.getElementsByClassName("bet")[0].innerHTML = score;
}

function buildKeyboard(round, tenKeys) {
    let keyboard = document
        .getElementById("new-round")
        .getElementsByClassName("numpad")[0];

    while (keyboard.firstChild) {
        keyboard.removeChild(keyboard.lastChild);
    }

    let addTen = tenKeys ? 10 : 0;

    let nKeys = Math.min(9, round);
    if (round == 10) {
        nKeys = 10;
    }
    for (let i = 0 + addTen; i <= nKeys + addTen; i++) {
        let button = document.createElement("button");
        button.setAttribute("onClick", `scoreboard.setValue(${i});`);
        button.classList.add("btn-item", `value-${i}`);
        if (i > round) {
            button.classList.add("inactive");
            button.disabled = true;
        }
        button.innerHTML = `${i}`;
        keyboard.appendChild(button);
    }

    if (round > 10) {
        let button = document.createElement("button");
        button.setAttribute("onClick", `buildKeyboard(${round}, ${!tenKeys});`);

        if (tenKeys) {
            button.classList.add("btn-item", "passive");
            button.innerHTML = "0-9";
        } else {
            button.classList.add("btn-item", "good");
            button.innerHTML = "10+";
        }

        keyboard.appendChild(button);
    }

    let delBtn = document.createElement("button");
    delBtn.setAttribute("onClick", "scoreboard.back();");
    delBtn.classList.add("btn-item", "bad", "backBtn");
    delBtn.innerHTML = "DEL";
    let span = 0;
    if (round > 9) {
        span = 1;
    } else {
        span = 4 - ((nKeys + 1) % 4);
    }
    delBtn.style.gridColumn = `span ${span}`;
    keyboard.appendChild(delBtn);

    if (!scoreboard.areBetting) {
        for (
            let i = scoreboard.remainingGot + 1;
            i <= scoreboard.cardsEach;
            i++
        ) {
            scoreboard.disableValue(i);
        }
    }

    if (
        scoreboard.areBetting &&
        scoreboard.isLastPlayer &&
        scoreboard.remainingBet >= 0
    ) {
        scoreboard.disableValue(scoreboard.remainingBet);
    }
}

function toNumRoundsScreen() {
    let maxRounds = Math.floor(52 / playerNames.numPlayers);

    let keyboard = document
        .getElementById("rounds")
        .getElementsByClassName("keyboard")[0];

    while (keyboard.getElementsByClassName("number")[0] != null) {
        keyboard.getElementsByClassName("number")[0].remove();
    }

    for (let i = maxRounds; i > 0; i--) {
        button = document.createElement("button");
        button.setAttribute("onClick", `setNumRounds(${i});`);
        button.classList.add("btn-item", "number");
        button.innerHTML = `${i}`;
        keyboard.insertBefore(button, keyboard.childNodes[0]);
    }
    keyboard.getElementsByClassName("back-btn")[0].style.gridColumn = `span ${
        4 - (maxRounds % 4)
    }`;
}

function toStatsScoresScreen() {
    switchScreen("stats-scores", "new-round");
    let rankElement = document.getElementById("score-ranks");

    while (rankElement.getElementsByClassName("btn-item")[0] != null) {
        rankElement.getElementsByClassName("btn-item")[0].remove();
    }

    let scores = Array();
    for (let i = 0; i < playerNames.numPlayers; i++) {
        scores.push(
            scoreboard.rounds[scoreboard.round - 1].players[i].totalScore
        );
    }

    ranks = rankArray(scores);

    for (let rank of ranks) {
        let div = document.createElement("div");
        div.classList.add("btn-item", "transparent");
        div.innerHTML = playerNames.names[rank].name;
        rankElement.appendChild(div);

        div = document.createElement("div");
        div.classList.add("btn-item", "transparent");
        div.innerHTML =
            scoreboard.rounds[scoreboard.round - 1].players[rank].totalScore;
        rankElement.appendChild(div);
    }
}

function toStatsCorrectBetsScreen() {
    switchScreen("stats-correct-bets", "stats-scores");
    let rankElement = document.getElementById("score-corr-bets");

    while (rankElement.getElementsByClassName("btn-item")[0] != null) {
        rankElement.getElementsByClassName("btn-item")[0].remove();
    }

    let scores = Array();
    for (let i = 0; i < playerNames.numPlayers; i++) {
        let sumCorrectBets = 0;
        for (let round of scoreboard.rounds) {
            console.log(round);
            console.log(round.players[i]);
            if (round.players[i].betCorrectly()) {
                sumCorrectBets++;
            }
        }
        scores.push(sumCorrectBets);
    }

    console.log(scores);

    ranks = rankArray(scores);

    for (let rank of ranks) {
        let div = document.createElement("div");
        div.classList.add("btn-item", "transparent");
        div.innerHTML = playerNames.names[rank].name;
        rankElement.appendChild(div);

        div = document.createElement("div");
        div.classList.add("btn-item", "transparent");
        div.innerHTML = scores[rank];
        rankElement.appendChild(div);
    }
}

function backFromStatsScoresScreen() {
    switchScreen("new-round", "stats-scores");
    scoreboard.reloadCompleteRound(true);
}

function rankArray(array) {
    // console.log(array);
    let sorted_array = Array.from(array);
    sorted_array.sort(function (a, b) {
        return b - a;
    });

    // console.log(sorted_array);

    let indices = Array();

    for (let element of array) {
        indices.push(sorted_array.indexOf(element));
    }

    // console.log(indices);

    let indicesOfIndices = Array();

    for (let i = 0; i < array.length; i++) {
        let searchFrom = 0;
        //console.log("searching", i);
        while (true) {
            let index = indices.slice(searchFrom).indexOf(i);
            if (index == -1) break;
            searchFrom += index;
            //console.log("index", searchFrom);
            indicesOfIndices.push(searchFrom);
            searchFrom++;
        }
    }

    // console.log(indicesOfIndices);
    return indicesOfIndices;
}

class Player {
    constructor(id) {
        this.id = id;
        this.bet = null;
        this.got = null;
        this.roundScore = null;
        this.totalScore = null;
        this.lastRound = null;
    }

    displayAll() {
        this.displayBet();
        this.displayGot();
        this.displayTotalScore();
    }

    displayBet() {
        let element = document
            .getElementById("scoresheet")
            .getElementsByClassName("bet")[this.id];

        if (this.bet == null) {
            element.innerHTML = "BET";
            element.classList.add("inactive");
        } else {
            element.innerHTML = this.bet;
            element.classList.remove("inactive");
        }
    }

    displayGot() {
        let element = document
            .getElementById("scoresheet")
            .getElementsByClassName("got")[this.id];

        if (this.got == null) {
            element.innerHTML = "GOT";
            element.classList.add("inactive");
            element.classList.remove("bad");
            element.classList.remove("good");
        } else {
            element.innerHTML = this.got;
            this.bet == this.got
                ? element.classList.add("good")
                : element.classList.add("bad");
            element.classList.remove("inactive");
        }
    }

    displayTotalScore() {
        let element = document
            .getElementById("scoresheet")
            .getElementsByClassName("sum")[this.id];

        if (this.roundScore == null) {
            if (this.lastRound == null) {
                element.innerHTML = "BET";
            } else {
                element.innerHTML = this.lastRound.totalScore;
            }
            element.classList.add("inactive");
        } else {
            element.innerHTML = this.totalScore;
            element.classList.remove("inactive");
        }
    }

    betCorrectly() {
        console.log(
            this.bet,
            this.got,
            this.bet == this.got && this.bet != null
        );
        return this.bet == this.got && this.bet != null;
    }

    removeBet() {
        this.bet = null;
        this.displayBet();
    }

    removeGot() {
        this.got = null;
        this.displayGot();
        this.removeRoundScore();
    }

    removeRoundScore() {
        this.roundScore = null;
        this.removeTotalScore();
    }

    removeTotalScore() {
        this.totalScore = null;
        this.displayTotalScore();
    }

    setBet(value) {
        this.bet = value;
        this.displayBet();
    }

    setGot(value) {
        this.got = value;
        this.setRoundScore(this.got + (this.bet == this.got ? 10 : 0));
        this.displayGot();
    }

    setRoundScore(value) {
        this.roundScore = value;
        this.setTotalScore(
            this.roundScore +
                (this.lastRound == null ? 0 : this.lastRound.totalScore)
        );
    }

    setTotalScore(value) {
        this.totalScore = value;
        this.displayTotalScore();
    }
}

class Round {
    constructor(index, cardsEach, numPlayers) {
        this.index = index;
        this.players = Array();
        for (let i = 0; i < numPlayers; i++) {
            this.players.push(new Player(i));
        }
    }
}

class Scoreboard {
    static suits = ["♡", "♧", "♢", "♤", "⨯"];
    constructor() {
        this.rounds = Array();
        this.index = 0;
    }

    setNumPlayers(players) {
        this.numPlayers = players;
    }

    setNumRounds(numRounds) {
        this.startRound = numRounds;
        this.newRound();
    }

    get suitIcon() {
        return Scoreboard.suits[this.suit];
    }

    get suit() {
        return this.round % 5;
    }

    get cardsEach() {
        let a = this.startRound - this.round;
        if (a < 1) a = 1 - a;
        return a;
    }

    getSuitIcon(round = this.round) {
        return Scoreboard.suits[this.getSuit(round)];
    }

    getSuit(round = this.round) {
        return round % 5;
    }

    getCardsEach(round = this.round) {
        let a = this.startRound - round;
        if (a < 1) a = 1 - a;
        return a;
    }

    get round() {
        return Math.floor(this.index / (2 * this.numPlayers));
    }

    get player() {
        return (this.round + this.index) % this.numPlayers;
    }

    get areBetting() {
        // otherwise getting
        return Math.floor(this.index / this.numPlayers) % 2 == 0;
    }

    get callPosition() {
        return this.index % this.numPlayers;
    }

    get isLastPlayer() {
        return this.callPosition == this.numPlayers - 1;
    }

    get hasRoundEnded() {
        return this.isLastPlayer && !this.areBetting;
    }

    get totalBet() {
        let bet = 0;
        for (const player of this.rounds[this.round].players) {
            // console.log(player);
            bet += player.bet;
        }
        // console.log(bet);
        return bet;
    }

    get totalGot() {
        let got = 0;
        for (const player of this.rounds[this.round].players) {
            // console.log(player);
            got += player.got;
        }
        // console.log(bet);
        return got;
    }

    get remainingGot() {
        return this.cardsEach - this.totalGot;
    }

    get remainingBet() {
        return this.cardsEach - this.totalBet;
    }

    setValue(value) {
        let player = this.rounds[this.round].players[this.player];
        this.areBetting ? player.setBet(value) : player.setGot(value);
        if (this.areBetting) {
            this.totalBet;
            document.getElementById("remaining-bet").innerHTML =
                -this.remainingBet;
        }
        this.next();

        if (
            scoreboard.areBetting &&
            scoreboard.cardsEach == 1 &&
            scoreboard.isLastPlayer &&
            this.remainingBet >= 0
        ) {
            this.setValue(1 - this.remainingBet);
            return;
        }

        if (this.areBetting && this.isLastPlayer && this.remainingBet >= 0) {
            this.disableValue(this.remainingBet);
        }

        if (!this.areBetting) {
            if (this.remainingGot == 0) {
                this.setValue(0);
            } else if (this.isLastPlayer) {
                this.setValue(this.remainingGot);
            } else {
                if (this.remainingGot != this.cardsEach) {
                    //console.log(this.remainingGot, this.cardsEach);
                    for (
                        let i = this.remainingGot + 1;
                        i <= this.cardsEach;
                        i++
                    ) {
                        this.disableValue(i);
                    }
                }
            }
        }
    }

    makeTable() {
        switchScreen("table-screen", "stats-correct-bets");
        let table = document.getElementById("table");
        let row = document.createElement("tr");

        let th = document.createElement("th");
        th.innerHTML = "Round";
        row.appendChild(th);
        for (let plyName of playerNames.names) {
            th = document.createElement("th");
            th.innerHTML = plyName.name;
            th.colSpan = 3;
            row.appendChild(th);
        }
        table.appendChild(row);

        document.body.style.backgroundColor = "white";

        for (let round of this.rounds) {
            let row = document.createElement("tr");
            let td = document.createElement("td");
            td.innerHTML = `${this.getCardsEach(round.index)}${this.getSuitIcon(
                round.index
            )}`;
            row.appendChild(td);
            console.log(round.players);
            for (let player of round.players) {
                console.log(player);
                let td = document.createElement("td");
                td.innerHTML = player.bet;
                row.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = player.got;
                row.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = player.totalScore;
                row.appendChild(td);
            }
            table.appendChild(row);
        }
    }

    disableValue(value) {
        let element = document
            .getElementById("new-round")
            .getElementsByClassName("numpad")[0]
            .getElementsByClassName(`value-${value}`)[0];
        //console.log(value, element);
        if (element != undefined) {
            element.disabled = true;
            element.classList.add("inactive");
        }
    }

    removeValue() {
        let player = this.rounds[this.round].players[this.player];
        this.areBetting ? player.removeBet() : player.removeGot();
        if (this.areBetting) {
            this.totalBet;
            document.getElementById("remaining-bet").innerHTML =
                this.remainingBet;

            for (let element of document
                .getElementById("new-round")
                .getElementsByClassName("numpad")[0]
                .getElementsByTagName("button")) {
                element.disabled = false;
                element.classList.remove("inactive");
            }

            if (
                scoreboard.areBetting &&
                scoreboard.cardsEach == 1 &&
                scoreboard.isLastPlayer &&
                this.remainingBet >= 0
            ) {
                this.back();
            }
        } else {
            if (this.remainingGot == 0) {
                this.back();
            } else if (this.isLastPlayer) {
                this.back();
            }
        }
    }

    newRound() {
        this.rounds.push(
            new Round(this.round, this.cardsEach, this.numPlayers)
        );

        let scoresheet = document.getElementById("scoresheet");

        while (scoresheet.firstChild) {
            scoresheet.removeChild(scoresheet.lastChild);
        }

        document.getElementById(
            "round-suit"
        ).innerHTML = `${this.cardsEach}${this.suitIcon}`;

        document.getElementById("remaining-bet").innerHTML = -this.cardsEach;

        if (this.round != 0) {
            for (let i = 0; i < this.numPlayers; i++) {
                this.rounds[this.round].players[i].lastRound =
                    this.rounds[this.round - 1].players[i];
            }
        }

        for (let i in playerNames.names) {
            // console.log(i);
            let div = document.createElement("div");
            div.classList.add("btn-item", `player-${i}`);
            div.innerHTML = playerNames.names[i].name;
            scoresheet.appendChild(div);

            div = document.createElement("div");
            div.classList.add("btn-item", "inactive", "bet");
            div.innerHTML = "BET";
            scoresheet.appendChild(div);

            div = document.createElement("div");
            div.classList.add("btn-item", "inactive", "got");
            div.innerHTML = "GOT";
            scoresheet.appendChild(div);

            div = document.createElement("div");
            div.classList.add("btn-item", "inactive", "sum");
            div.innerHTML = "SUM";
            scoresheet.appendChild(div);
        }

        document.getElementById("next-round").classList.add("hide");
        document
            .getElementById("new-round")
            .getElementsByClassName("numpad")[0]
            .classList.remove("hide");

        for (let player of this.rounds[this.round].players) {
            player.displayAll();
        }

        buildKeyboard(this.cardsEach, false);
    }

    returnToRound() {
        document.getElementById("next-round").classList.add("hide");
        document
            .getElementById("new-round")
            .getElementsByClassName("numpad")[0]
            .classList.remove("hide");
        this.index--;
        this.removeValue();
    }

    reloadCompleteRound(fromEndGame = false) {
        console.log(this.index);
        if (fromEndGame) {
            this.index--;
        }
        console.log(this.index, this.round);
        for (let player of this.rounds[this.round].players) {
            player.displayAll();
        }

        document.getElementById(
            "round-suit"
        ).innerHTML = `${this.cardsEach}${this.suitIcon}`;

        document.getElementById("remaining-bet").innerHTML = -this.remainingBet;
        this.nextRoundButtons();
    }

    back() {
        if (this.index == 0) {
            switchScreen("rounds", "new-round");
        } else {
            let currentRound = this.round;
            this.index--;
            if (this.round != currentRound) {
                this.reloadCompleteRound();
                this.nextRoundButtons();
                return;
            }
            //midround
            this.removeValue();
        }
    }

    nextRoundButtons() {
        let dealer =
            playerNames.names[(this.player + 1) % this.numPlayers].name;
        this.index++;
        // console.log("round ended");
        document.getElementById("next-round").classList.remove("hide");
        document
            .getElementById("new-round")
            .getElementsByClassName("numpad")[0]
            .classList.add("hide");
        document
            .getElementById("next-round")
            .getElementsByClassName("next")[0].innerHTML = `next round <br /> ${
            this.cardsEach
        }${Scoreboard.suits[this.suit]} <br /> ${dealer} is Dealer`;
    }

    next() {
        if (this.hasRoundEnded) {
            this.nextRoundButtons();
        } else {
            this.index++;
        }
    }
}

class Scoreboard2 {
    static suits = ["♡", "♧", "♢", "♤", "⨯"];

    constructor(numPlayers, numRounds, backup) {
        this.numPlayers = numPlayers;
        this.index = 0;
        this.startRound = numRounds;
        this.totalRounds = numRounds * (backup ? 2 : 1);
        this.values = Array(2 * numPlayers * this.totalRounds).fill(null);
        this.totals = Array(numPlayers * numRounds).fill(null);
        this.maxIndex = this.values.length;

        this.reviewNumPad();
        this.htmlMakeTable();
    }

    get suit() {
        return this.round % 5;
    }

    get cardsEach() {
        let a = this.startRound - this.round;
        if (a < 1) a = 1 - a;
        return a;
    }

    get round() {
        return Math.floor(this.index / (2 * this.numPlayers));
    }

    get player() {
        return (this.round + this.index) % this.numPlayers;
    }

    get betOrGot() {
        return Math.floor(this.index / this.numPlayers) % 2 == 0;
    }

    get totalBet() {
        let startIndex = this.round * this.numPlayers * 2;
        let bets = this.values.slice(startIndex, startIndex + this.numPlayers);
        //console.log(bets);
        return bets.reduce((a, b) => a + b, 0);
    }

    get totalGot() {
        let startIndex = this.round * this.numPlayers * 2 + this.numPlayers;
        let bets = this.values.slice(startIndex, startIndex + this.numPlayers);
        //console.log(bets);
        return bets.reduce((a, b) => a + b, 0);
    }

    get remainingGot() {
        return this.cardsEach - this.totalGot;
    }

    get remainingBet() {
        return this.cardsEach - this.totalBet;
    }

    get callPosition() {
        return this.index % this.numPlayers;
    }

    get isLastCaller() {
        return this.callPosition == this.numPlayers - 1;
    }

    indexInfo() {
        let suits = ["♡", "♧", "♢", "♤", "⨯"];
        console.log(
            `Round: ${this.round}, Player: ${this.player}, Mode: ${
                this.betOrGot ? "bet" : "got"
            }, CardsEach: ${this.cardsEach}, Suit: ${suits[this.suit]}
                `
        );
    }

    set(n) {
        if (this.value == 1 && this.cardsEach >= 10) {
            this.value = 10 + n;
            this.next();
        } else {
            this.value = n;
            if (
                n != 1 ||
                this.cardsEach < 10 ||
                (!this.betOrGot && this.remainingGot < 10)
            )
                this.next();
        }

        while (
            !this.betOrGot &&
            this.remainingGot == 0 &&
            this.index + 1 != this.maxIndex
        ) {
            this.value = 0;
            this.next();
        }

        if (!this.betOrGot && this.isLastCaller) {
            this.value = this.remainingGot;
            this.next();
        }

        //console.log(this.values);
        this.reviewNumPad();
    }

    reviewNumPad() {
        function getButton(num) {
            return document
                .getElementById("buttons")
                .getElementsByClassName(`button-${num}`)[0];
        }

        // reset buttons
        for (let i = 0; i <= 9; i++) {
            getButton(i).disabled = false;
            getButton(i).classList.remove("got-btn");
        }

        if (this.value == 1) {
            for (let i = this.cardsEach - 10 + 1; i <= 9; i++) {
                getButton(i).disabled = true;
            }
        } else {
            for (let i = 0; i <= 9; i++) {
                getButton(i).disabled = this.cardsEach < i;
            }
        }

        //console.log(this.isLastCaller, this.betOrGot, this.remainingBet);
        if (this.isLastCaller && this.betOrGot) {
            if (this.remainingBet >= 0 && this.remainingBet <= 9) {
                getButton(this.remainingBet).disabled = true;
            }
        }

        if (!this.betOrGot && this.remainingGot < 9) {
            for (let i = this.remainingGot + 1; i <= 9; i++) {
                getButton(i).disabled = true;
            }
        }

        if (!this.betOrGot) {
            let bet = this.values[this.index - 4];
            if (bet >= 0 && bet <= 9) {
                if (!getButton(bet).disabled)
                    getButton(bet).classList.add("got-btn");
            }
        }

        document.getElementById("button-next").disabled =
            this.index + 1 == this.maxIndex || this.value == null;
        document.getElementById("button-back").disabled =
            this.index == 0 && this.value == null;
    }

    next(reviewNumPad = false) {
        if (this.index + 1 != this.maxIndex) this.index++;
        if (reviewNumPad) this.reviewNumPad();
    }

    autoBack() {
        let wentBack = false;
        while (!this.betOrGot && this.remainingGot == 0) {
            if (this.value >= 10) {
                this.value = 1;
            } else if (this.value == null) {
                this.index--;
            } else {
                this.value = null;
            }
            wentBack = true;
        }

        if (!this.betOrGot && this.isLastCaller) {
            this.value = null;
            this.index--;
            if (this.value >= 10) {
                this.value = 1;
            } else {
                this.value = null;
            }
            wentBack = true;
        }

        return wentBack;
    }

    back() {
        if (this.autoBack()) {
            this.reviewNumPad();
            return;
        }

        if (this.value >= 10) {
            this.value = 1;
        } else if (this.value == null) {
            if (this.index != 0) this.index--;
            if (this.autoBack()) {
                this.reviewNumPad();
                return;
            }
            if (this.value >= 10) {
                this.value = 1;
            } else {
                this.value = null;
            }
        } else {
            this.value = null;
            if (this.index != 0) this.index--;
        }
        //console.log(this.values);
        this.reviewNumPad();
    }

    get value() {
        return this.values[this.index];
    }

    set value(n) {
        this.values[this.index] = n;

        let cellIndex = this.index % (this.numPlayers * 2);
        // convert cell index to table bet/get cols
        cellIndex =
            cellIndex < this.numPlayers
                ? cellIndex * 3
                : (cellIndex - this.numPlayers) * 3 + 1;
        document.getElementById("table").rows[this.round + 1].cells[
            cellIndex + 1
        ].innerHTML = n;

        if (!this.betOrGot) {
            let totalIndex =
                (this.index % this.numPlayers) + this.numPlayers * this.round;
            // console.log(
            //     this.index,
            //     this.values[this.index - 1],
            //     this.values[this.index],
            //     totalIndex
            // );

            if (
                this.values[this.index - this.numPlayers] ==
                this.values[this.index]
            ) {
                this.totals[totalIndex] = this.values[this.index] + 10;
            } else {
                this.totals[totalIndex] = this.values[this.index];
            }

            if (
                totalIndex >= this.numPlayers &&
                this.totals[totalIndex] != null
            ) {
                this.totals[totalIndex] +=
                    this.totals[totalIndex - this.numPlayers];
            }

            document.getElementById("table").rows[this.round + 1].cells[
                cellIndex + 2
            ].innerHTML = this.totals[totalIndex];
        }
    }

    htmlMakeTable() {
        let row = document.createElement("tr");
        let header = document.createElement("th");
        header.innerHTML = `Round`;
        row.appendChild(header);

        for (let i = 0; i < this.numPlayers; i++) {
            header = document.createElement("th");
            header.innerHTML = `Player ${i + 1}`;
            header.colSpan = 3;
            row.appendChild(header);
        }

        document.getElementById("table").appendChild(row);

        //console.log(this.totalRounds);
        for (let i = 0; i < this.totalRounds; i++) {
            this.makeRow(i);
        }
    }

    makeRow(round) {
        let row = document.createElement("tr");
        let data = document.createElement("td");
        let cardsEach = this.startRound - round;
        if (cardsEach < 1) cardsEach = 1 - cardsEach;
        data.innerHTML = `${cardsEach} ${Scoreboard2.suits[round % 5]}`;
        row.appendChild(data);

        for (let i = 0; i < this.numPlayers * 3; i++) {
            data = document.createElement("td");
            data.innerHTML = "";
            row.appendChild(data);
        }

        document.getElementById("table").appendChild(row);
    }
}

let playerNames = new PlayerNames();
let scoreboard = new Scoreboard();
//createKeyboard();
