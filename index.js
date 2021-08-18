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

        console.log(this.names);
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

function toWelcomeScreen() {
    document.getElementById("welcome").classList.remove("hide");
    document.getElementById("players").classList.add("hide");
}

function toPlayerScreen(from) {
    document.getElementById("players").classList.remove("hide");
    document.getElementById(from).classList.add("hide");
}

function toNumRoundsScreen() {
    document.getElementById("rounds").classList.remove("hide");
    document.getElementById("players").classList.add("hide");
    let maxRounds = Math.floor(52 / playerNames.numPlayers);

    let keyboard = document
        .getElementById("rounds")
        .getElementsByClassName("keyboard")[0];

    while (keyboard.getElementsByClassName("number")[0] != null) {
        keyboard.getElementsByClassName("number")[0].remove();
    }

    for (let i = maxRounds; i > 0; i--) {
        button = document.createElement("button");
        button.setAttribute("onClick", ``);
        button.classList.add("btn-item", "number");
        button.innerHTML = `${i}`;
        keyboard.insertBefore(button, keyboard.childNodes[0]);
    }
    keyboard.getElementsByClassName("back-btn")[0].style.gridColumn = `span ${
        4 - (maxRounds % 4)
    }`;
}

let playerNames = new PlayerNames();
//createKeyboard();
