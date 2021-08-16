console.log("Oh Hell Scoreboard");

function nullToZero(value) {
    return value == null ? 0 : value;
}

class Scoreboard1 {
    static modes = {
        GET: "get",
        BET: "bet",
    };

    static suits = ["♡", "♧", "♢", "♤", "⨯"];

    constructor(numPlayers, rounds, backup) {
        this.numPlayers = numPlayers;
        this.firstCaller = 0;
        this.selectedPlayer = 0;
        this.currentRound = 0;
        this.suit = 4;
        this.cardsEach = rounds + 1;
        this.roundDirection = -1;
        this.bets = Array();
        this.gets = Array();
        this.mode = Scoreboard1.modes.BET;

        // create html table header
        let row = document.createElement("tr");
        let header = document.createElement("th");
        header.innerHTML = `Round`;
        row.appendChild(header);

        for (let i = 0; i < this.numPlayers; i++) {
            header = document.createElement("th");
            header.innerHTML = `Player ${i + 1}`;
            header.colSpan = 2;
            row.appendChild(header);
        }

        document.getElementById("table").appendChild(row);

        this.newRound();
        this.controlButtons();

        // this.back();
    }

    newRound() {
        this.bets.push(Array(this.numPlayers).fill(null));
        this.gets.push(Array(this.numPlayers).fill(null));

        console.log(this.bets);
        console.log(this.gets);

        this.suit++;
        this.suit %= 5;
        this.cardsEach += this.roundDirection;
        if (this.cardsEach == 0) {
            this.cardsEach = 1;
            this.roundDirection = 1;
        }

        // create html row
        let row = document.createElement("tr");
        row.classList.add(`round-${this.currentRound}`);
        let data = document.createElement("td");
        data.innerHTML = `${this.cardsEach} ${Scoreboard1.suits[this.suit]}`;
        row.appendChild(data);

        for (let i = 0; i < this.numPlayers; i++) {
            for (const mode of ["bet", "got"]) {
                data = document.createElement("td");
                data.classList.add(`player-${i}-${mode}`);
                data.innerHTML = "";
                row.appendChild(data);
            }
        }

        document.getElementById("table").appendChild(row);
    }

    next() {
        this.selectedPlayer++;
        this.selectedPlayer %= this.numPlayers;
        if (this.selectedPlayer == this.firstCaller) {
            if (this.mode == Scoreboard1.modes.BET) {
                this.mode = Scoreboard1.modes.GET;
            } else {
                this.mode = Scoreboard1.modes.BET;
                this.firstCaller++;
                this.firstCaller %= this.numPlayers;
                this.selectedPlayer = this.firstCaller;
                this.currentRound++;
                this.newRound();
            }
        }

        console.log("selected player", this.selectedPlayer);
    }

    get lastCaller() {
        return (this.firstCaller + this.numPlayers - 1) % this.numPlayers;
    }

    get totalBet() {
        return this.bets[this.currentRound].reduce((a, b) => a + b, 0);
    }

    get totalGot() {
        return this.gets[this.currentRound].reduce(
            (a, b) => nullToZero(a) + nullToZero(b),
            0
        );
    }

    controlButtons() {
        if (this.selectedCell == 1) {
            for (let i = this.cardsEach - 10 + 1; i <= 9; i++) {
                this.disableNumber(i, true);
            }
        } else {
            for (let i = 0; i <= 9; i++) {
                this.disableNumber(i, this.cardsEach < i);
            }
        }

        if (this.lastCaller == this.selectedPlayer) {
            let remaining = this.cardsEach - this.totalBet;
            if (remaining >= 0 && remaining <= 9) {
                this.disableNumber(remaining, true);
            }
        }

        if (this.mode == Scoreboard1.modes.GET) {
            let remaining = this.cardsEach - this.totalGot;
            if (remaining < 9) {
                for (let i = remaining + 1; i <= 9; i++) {
                    this.disableNumber(i, true);
                }
            }
        }
    }

    disableNumber(num, boolean) {
        //console.log(`button-${num}`, num, boolean);
        document
            .getElementById("buttons")
            .getElementsByClassName(`button-${num}`)[0].disabled = boolean;
    }

    back() {
        if (this.selectedCell > 9) {
            this.selectedCell = 1;
        } else {
            this.selectedCell = null;

            this.selectedPlayer += this.numPlayers - 1;
            this.selectedPlayer %= this.numPlayers;
            if (this.selectedPlayer == this.lastCaller) {
                if (this.mode == Scoreboard1.modes.GET) {
                    this.mode = Scoreboard1.modes.BET;
                } else {
                    this.mode = Scoreboard1.modes.GET;
                    this.firstCaller += this.numPlayers - 1;
                    this.firstCaller %= this.numPlayers;
                    this.selectedPlayer = this.lastCaller;
                    this.currentRound--;
                }
            }
            console.log("selected player", this.selectedPlayer);
        }
    }

    set(value) {
        let capGot =
            this.mode == Scoreboard1.modes.GET &&
            this.cardsEach - this.totalGot < 10;

        console.log(capGot, this.cardsEach, this.totalGot);

        if (this.selectedCell == 1 && this.cardsEach > 9) {
            this.selectedCell = 10 + value;
            this.next();
        } else {
            this.selectedCell = value;
            if (value != 1 || this.cardsEach < 10 || capGot) this.next();
        }

        if (
            this.mode == Scoreboard1.modes.GET &&
            this.cardsEach == this.totalGot
        ) {
            this.set(0);
        }

        if (
            this.selectedPlayer == this.lastCaller &&
            this.mode == Scoreboard1.modes.GET
        ) {
            let remaining = this.cardsEach - this.totalGot;
            this.set(remaining);
        }

        this.controlButtons();
    }

    set selectedCell(value) {
        console.log(
            `Player ${this.selectedPlayer}, Round: ${this.currentRound}, ${this.mode}: ${value}`
        );

        if (this.mode == Scoreboard1.modes.BET) {
            this.bets[this.currentRound][this.selectedPlayer] = value;
            document
                .getElementById("table")
                .getElementsByClassName(`round-${this.currentRound}`)[0]
                .getElementsByClassName(
                    `player-${this.selectedPlayer}-bet`
                )[0].innerHTML = value;
        } else {
            this.gets[this.currentRound][this.selectedPlayer] = value;
            document
                .getElementById("table")
                .getElementsByClassName(`round-${this.currentRound}`)[0]
                .getElementsByClassName(
                    `player-${this.selectedPlayer}-got`
                )[0].innerHTML = value;
        }
    }

    get selectedCell() {
        if (this.mode == Scoreboard1.modes.BET) {
            return this.bets[this.currentRound][this.selectedPlayer];
        } else {
            return this.gets[this.currentRound][this.selectedPlayer];
        }
    }
}

class Player {
    constructor(scoreboard, id) {
        this.scoreboard = scoreboard;
        this.bet = 0;
        this.got = 0;
        this.id = id;
    }

    updateBet(bet) {
        this.bet = bet;
        // document
        //     .getElementById(`player-${this.id}`)
        //     .getElementsByClassName("score")[0].innerHTML = this.bet;

        let sign = this.scoreboard.roundDirection == 1 ? "+" : "-";
        console.log(`round-${this.scoreboard.round} player${sign}${this.id}`);

        document
            .getElementById("table")
            .getElementsByClassName(`round${sign}${this.scoreboard.round}`)[0]
            .getElementsByClassName(`player-${this.id}-bet`)[0].innerHTML =
            this.bet;

        if (Number.isInteger(this.bet)) {
            for (let i = 9; i >= 1; i--) {
                let newBet = this.bet * 10 + i;
                if (newBet > this.scoreboard.round) {
                    document
                        .getElementById("buttons")
                        .getElementsByClassName(
                            `button-${i}`
                        )[0].disabled = true;
                } else {
                    break;
                }
            }
        } else {
            this.scoreboard.enableNumButtons();
        }
    }

    reset_bet() {
        this.updateBet("_");
    }

    remove_from_bet() {
        if (Number.isInteger(this.bet)) {
            if (this.bet < 10) {
                this.reset_bet();
            } else {
                let newBet = Math.floor(this.bet / 10);
                this.updateBet(newBet);
            }
        }
    }

    add_to_bet(value) {
        if (!Number.isInteger(this.bet)) {
            this.bet = 0;
        }
        let newBet = this.bet * 10 + value;
        if (newBet <= this.scoreboard.round) {
            this.updateBet(newBet);

            let autoNext = true;

            for (let i = 9; i >= 0; i--) {
                let newBet = this.bet * 10 + i;
                if (newBet > this.scoreboard.round) {
                    document
                        .getElementById("buttons")
                        .getElementsByClassName(
                            `button-${i}`
                        )[0].disabled = true;
                } else {
                    autoNext = false;
                    break;
                }
            }

            if (autoNext || this.bet == 0) {
                this.scoreboard.next();
            } else {
                document.getElementById("button-next").disabled = false;
            }
        } else {
            console.log(
                `New bet is too high ${newBet} > ${this.scoreboard.round}`
            );
        }
    }

    add_to_got(value) {
        if (!Number.isInteger(this.got)) {
            this.bet = 0;
        }
        let newGot = this.got * 10 + value;
        if (newGot <= this.scoreboard.round) {
            this.updateBet(newBet);

            let autoNext = true;

            for (let i = 9; i >= 0; i--) {
                let newBet = this.bet * 10 + i;
                if (newBet > this.scoreboard.round) {
                    document
                        .getElementById("buttons")
                        .getElementsByClassName(
                            `button-${i}`
                        )[0].disabled = true;
                } else {
                    autoNext = false;
                    break;
                }
            }

            if (autoNext || this.bet == 0) {
                this.scoreboard.next();
            } else {
                document.getElementById("button-next").disabled = false;
            }
        } else {
            console.log(
                `New bet is too high ${newBet} > ${this.scoreboard.round}`
            );
        }
    }
}

class Scoreboard {
    static suits = ["♡", "♧", "♢", "♤", "⨯"];

    constructor(numPlayers) {
        this.players = Array();
        this.round = 13 + 1;
        this.selected_player = 0;
        this.numPlayers = numPlayers;
        this.suit = 0;
        this.roundDirection = -1;
        this.first = 0;
        this.mode = "bet";

        let row = document.createElement("tr");
        let header = document.createElement("th");
        header.innerHTML = `Round`;
        row.appendChild(header);

        for (let i = 0; i < numPlayers; i++) {
            header = document.createElement("th");
            header.innerHTML = `Player ${i + 1}`;
            header.colSpan = 2;
            row.appendChild(header);

            this.players.push(new Player(this, i));
            // let div = document.createElement("div");
            // div.id = `player-${i}`;

            // let para = document.createElement("p");
            // para.className = "score";
            // let node = document.createTextNode(`players ${i}'s score`);
            // para.appendChild(node);
            // div.appendChild(para);

            // document.getElementById("players").appendChild(div);
        }

        console.log(this.players);
        document.getElementById("table").appendChild(row);
        this.addRound();
    }

    totalBet() {
        let total = 0;
        for (const player of this.players) {
            if (Number.isInteger(player.bet)) {
                total += player.bet;
            }
        }
        return total;
    }

    addRound() {
        this.round += this.roundDirection;
        if (this.round == 0) {
            this.round = 1;
            this.roundDirection = 1;
        }

        let row = document.createElement("tr");
        let sign = this.roundDirection == 1 ? "+" : "-";
        row.classList.add(`round${sign}${this.round}`);
        let data = document.createElement("td");
        data.innerHTML = `${this.round} ${Scoreboard.suits[this.suit]}`;
        row.appendChild(data);

        console.log("adding round");

        let cols = ["bet", "got"];
        for (let i = 0; i < this.numPlayers; i++) {
            this.players[i].bet = "_";
            for (const betGot of cols) {
                data = document.createElement("td");
                data.classList.add(`player-${i}-${betGot}`);
                data.innerHTML = "";
                row.appendChild(data);
            }
        }

        document.getElementById("table").appendChild(row);

        this.suit++;
        this.suit %= 5;

        this.enableNumButtons();
    }

    add_to_bet(value) {
        if (this.mode == "bet") {
            this.players[this.selected_player].add_to_bet(value);
        } else {
            this.players[this.selected_player].got(value);
        }
    }

    next() {
        this.selected_player++;
        this.selected_player %= this.numPlayers;
        if (this.selected_player == this.first) {
            console.log("first");
            if (this.mode == "bet") {
                this.mode = "got";
            } else {
                this.mode = "bet";
                this.first++;
                this.first %= this.numPlayers;
                this.selected_player = this.first;
                this.addRound();
                this.updateRound();
                this.players[this.selected_player].reset_bet();
            }
        }
        if (this.mode == "bet") {
            this.players[this.selected_player].reset_bet();
        }
        document.getElementById("button-next").disabled = true;
        document.getElementById("button-back").disabled = false;
    }

    back() {
        if (this.players[this.selected_player].bet == "_") {
            this.selected_player--;
            if (this.selected_player == -1) {
                this.selected_player = this.numPlayers - 1;
                this.addRound();
                this.updateRound();
            }
        }

        this.players[this.selected_player].remove_from_bet();

        if (
            this.round == 13 &&
            this.selected_player == 0 &&
            this.players[this.selected_player].bet == "_"
        ) {
            document.getElementById("button-back").disabled = true;
        }
    }

    updateRound() {
        //document.getElementById("round").innerHTML = `Round: ${this.round}`;
    }

    enableNumButtons() {
        let lastPlayer = (this.first + this.numPlayers - 1) % this.numPlayers;
        let remainingBet = this.round - this.totalBet();
        console.log(lastPlayer, remainingBet, this.totalBet());
        for (let i = 0; i <= 9; i++) {
            document
                .getElementById("buttons")
                .getElementsByClassName(`button-${i}`)[0].disabled =
                i > this.round ||
                (lastPlayer == this.selected_player && i == remainingBet);
        }
    }
}

function createButtons() {
    for (let i = 0; i <= 9; i++) {
        button = document.createElement("button");
        button.setAttribute("onClick", `scoreboard.set(${i})`);
        button.classList.add(`button-${i}`);
        button.innerHTML = `${i}`;
        document.getElementById("buttons").appendChild(button);
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

createButtons();
//scoreboard = new Scoreboard(4);

//scoreboard = new Scoreboard1(4, 13, true);
scoreboard = new Scoreboard2(4, 13, true);
// Feastures:
// Num-Pad:
//  Bet:
//      Automatic next cell once an additional digit would exceed max bet
//      Button disabling of 'perfect bet' for last caller
//  Get:
//      Automatic next cell once an additional digit would exceed remaining available cards
//      Automatic cell completion of what last player got
//      Automatic cell zeroing of 'gets' for remaining players when all cards in round accounted for
//      Button disabling for values which would exceed remaining available cards
// Next:
//      Enable only for second-digit of calls >= 10 when max bet >= 10
//      Enable if valid bet/get entered after clicking back
// Back:
//      Using Num-Pad should override bet/get last digit
//      After deleting first digit move back one step
// Del:
//      ???

// if click 9 then show 9-17 (or empty)
// empty instead of disable
