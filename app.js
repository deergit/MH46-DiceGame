const dieImage = document.getElementById("dieImage");
const caption = document.getElementById("caption");
const playerContainer = document.getElementById("playerContainer");

const rollBtn = document.getElementById("rollBtn");
const holdBtn = document.getElementById("holdBtn");
const addPlrBtn = document.getElementById("addPlrBtn");
const resetBtn = document.getElementById("resetBtn");

rollBtn.disabled = false;
rollBtn.hidden = false;
holdBtn.disabled = true;
holdBtn.hidden = true;
addPlrBtn.disabled = false;
addPlrBtn.hidden = false;
resetBtn.disabled = false;
resetBtn.hidden = false;

const gameState = {
    players: [],
    scoreLimit: 20,
    gameRunning: false,
    currentPlayer: 0,
    pCount: 0,
    turn: 0,
    turnTimer: 2000,

    addPlayer(repeats = 1) {
        if (!this.gameRunning) {
            do {
                this.players.push({ id: this.players.length + 1, score: 0, roll: 0, hold: false, out: false });

                const newPlayer = document.createElement("div");

                newPlayer.classList.add("playerBox");
                newPlayer.id = `p${this.players.length}`;
                newPlayer.innerHTML = `<h2>Player ${this.players.length}</h2>\n<h3>Score: 0</h3>\n<h4>In</h4>`;

                playerContainer.appendChild(newPlayer);
                repeats--;
            } while (repeats > 0);

            this.pCount = this.players.length;
        }
    },

    roll() {
        this.gameRunning = true;
        caption.textContent = "";
        resetBtn.textContent = "Quit";
        dieImage.style.border = "none";

        rollBtn.disabled = true;
        rollBtn.hidden = false;
        resetBtn.disabled = true;
        holdBtn.disabled = true;

        if (this.players.length > 1) { holdBtn.hidden = false; }

        addPlrBtn.disabled = true;
        addPlrBtn.hidden = true;

        if (this.turn <= 1) { document.getElementById(`p${this.currentPlayer + 1}`).style.backgroundColor = "rgba(0, 100, 0, 0.25)"; }

        let dieRoll = Math.ceil(Math.random() * 6);

        let di = 30;
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                dieImage.src = `./images/${Math.ceil(Math.random() * 6)}.png`;
            }, di);
            di += (di / 2);
        }

        setTimeout(() => {
            dieImage.src = `./images/${dieRoll}.png`;

            if (dieRoll > 1) {
                this.players[this.currentPlayer].score += dieRoll;
                dieImage.style.border = "8px solid rgba(0, 100, 0, 0.5)";
                rollBtn.disabled = false;
                resetBtn.disabled = false;
                holdBtn.disabled = false;
            } else if (this.players.length > 1) {
                this.players[this.currentPlayer].out = true;
                this.players[this.currentPlayer].score += dieRoll;
                this.pCount--;
                dieImage.style.border = "8px solid rgba(100, 0, 0, 0.5)";
                document.getElementById(`p${this.currentPlayer + 1}`).style.backgroundColor = "rgba(100, 0, 0, 0.25)";
                document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h4").textContent = "Out";
                setTimeout(() => {
                    this.nextTurn();
                }, this.turnTimer);
            } else {
                dieImage.style.border = "8px solid rgba(100, 0, 0, 0.5)";
                setTimeout(() => {
                    this.lose();
                }, 250);
            }

            document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h3").textContent = `Score: ${this.players[this.currentPlayer].score}`;

            if (this.players[this.currentPlayer].score >= this.scoreLimit) {
                setTimeout(() => {
                    this.win(this.players[this.currentPlayer]);
                }, 250);
            }

            if (this.players.length > 1 && this.pCount === 1) {
                setTimeout(() => {
                    this.win(this.players[this.currentPlayer]);
                }, 250);
            }
        }, this.turnTimer);
    },

    hold() {
        if (this.players.length > 1) {
            this.players[this.currentPlayer].hold = true;
            document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h4").textContent = "Hold";
            this.nextTurn();
        }
    },

    nextTurn(){
        let nextPlayer = this.currentPlayer + 1;
        let recheck = false;
        dieImage.style.border = "none";
        rollBtn.disabled = false;
        resetBtn.disabled = false;
        holdBtn.disabled = false;
        holdBtn.hidden = false;

        document.getElementById(`p${this.currentPlayer + 1}`).style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        do {
            if (this.players[nextPlayer]) {
                if (!this.players[nextPlayer].out) {
                    document.getElementById(`p${nextPlayer + 1}`).style.backgroundColor = "rgba(0, 100, 0, 0.25)";
                    this.currentPlayer = nextPlayer;
                    recheck = false;
                } else {
                    nextPlayer++;
                    recheck = true;
                }
            } else {
                nextPlayer = 0;
                recheck = true;
            }
        } while (recheck)

        if (this.players[this.currentPlayer].hold) {
            this.players[this.currentPlayer].hold = false;
            document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h4").textContent = "In";
        }
    },

    win(winner) {
        rollBtn.disabled = true;
        rollBtn.hidden = false;
        holdBtn.disabled = true;
        holdBtn.hidden = true;
        resetBtn.disabled = true;
        resetBtn.hidden = false;

        resetBtn.textContent = "Reset";

        if (this.players.length > 1) {
            dieImage.src = "./images/diceStart.png";
            caption.innerHTML = `Player ${winner.id}<br>has won<br>the game!`;
            setTimeout(() => {
                this.reset(true);
            }, this.turnTimer);
        } else {
            dieImage.src = "./images/diceStart.png";
            caption.innerHTML = `You<br>have won<br>the game!`;
            setTimeout(() => {
                this.reset(true);
            }, this.turnTimer);
        }
    },

    lose() {
        rollBtn.disabled = true;
        rollBtn.hidden = false;
        holdBtn.disabled = true;
        holdBtn.hidden = true;
        resetBtn.disabled = true;
        resetBtn.hidden = false;

        resetBtn.textContent = "Reset";

        dieImage.src = "./images/diceStart.png";
        caption.innerHTML = 'You have lost<br>the game';
        document.getElementById(`p${this.currentPlayer + 1}`).style.backgroundColor = "rgba(100, 0, 0, 0.25)";
        setTimeout(() => {
            this.reset(true);
        }, this.turnTimer);
    },

    reset(kPlayers = false) {
        let pTotal = this.players.length;

        this.gameRunning = false;
        this.players = [];
        this.currentPlayer = 0;
        this.pCount = 0;
        this.turn = 0;

        rollBtn.disabled = false;
        rollBtn.hidden = false;
        holdBtn.disabled = true;
        holdBtn.hidden = true;
        addPlrBtn.disabled = false;
        addPlrBtn.hidden = false;
        resetBtn.disabled = false;
        resetBtn.hidden = false;

        resetBtn.textContent = "Reset";

        playerContainer.innerHTML = "";
        dieImage.src = "./images/diceStart.png";
        dieImage.style.border = "none";
        caption.innerHTML = 'Press + to add<br>more players<br><br><br>Press "Roll"<br>to begin';

        kPlayers ? this.addPlayer(pTotal) : this.addPlayer();
    }
}

rollBtn.addEventListener("click", () => {
    gameState.roll();
    gameState.turn++;
});

holdBtn.addEventListener("click", () => {
    gameState.hold();
    gameState.turn++;
});

addPlrBtn.addEventListener("click", () => {
    gameState.addPlayer();
});

resetBtn.addEventListener("click", () => {
    gameState.reset();
});

gameState.addPlayer();