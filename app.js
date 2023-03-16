const dieImage = document.getElementById("dieImage");
const playerContainer = document.getElementById("playerContainer");

const rollBtn = document.getElementById("rollBtn");
const holdBtn = document.getElementById("holdBtn");
const addPlrBtn = document.getElementById("addPlrBtn");
const resetBtn = document.getElementById("resetBtn");

const gameState = {
    players: [],
    scoreLimit: 20,
    gameRunning: false,
    currentPlayer: 0,
    pCount: 0,

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
        let dieRoll = Math.ceil(Math.random() * 6);

        // console.log(`Player ${this.currentPlayer + 1} rolled: ${dieRoll}`);

        this.gameRunning = true;
        
        if (this.players.length > 1) {
            if (dieRoll > 1) {
                this.players[this.currentPlayer].score += dieRoll;
            } else {
                this.players[this.currentPlayer].out = true;
                this.players[this.currentPlayer].score += dieRoll;
                this.pCount--;
                document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h4").textContent = "Out";
                this.nextTurn();
            }
        } else {
            if (dieRoll > 1) {
                this.players[this.currentPlayer].score += dieRoll;
            } else {
                this.lose();
            }
        }

        document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h3").textContent = `Score: ${this.players[this.currentPlayer].score}`;

        // console.log(`Player ${this.currentPlayer + 1} score: ${this.players[this.currentPlayer].score}`);

        if (this.players[this.currentPlayer].score >= this.scoreLimit) {
            this.win(this.players[this.currentPlayer]);
        }

        if (this.pCount === 1 && this.players.length > 1) {
            this.winCheck();
        } else if (this.pCount === 0) {
            this.lose();
        }
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

        if (this.players.length > 1) {
            do {
                if (this.players[nextPlayer]) {
                    if (!this.players[nextPlayer].out) {
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
        }
    },

    winCheck() {
        let eligiblePlayers = [];

        this.players.forEach((player) => {
            if (!player.out) {
                eligiblePlayers.push(player);
            }
        });

        const winner = eligiblePlayers.reduce(
            (prev, current) => {
                return prev.score > current.score ? prev : current;
            }
        );
        this.win(winner);
    },

    win(winner) {
        if (this.players.length > 1) {
            alert(`Player ${winner.id} has won the game!`);
            this.reset(true);
        } else {
            alert("You have won the game!");
        }
    },

    lose() {
        alert(`You have lost the game!`);
        this.reset(true);
    },

    reset(kPlayers = false) {
        let pTotal = this.players.length;
        
        this.gameRunning = false;
        this.players = [];
        this.currentPlayer = 0;
        this.pCount = 0;

        playerContainer.innerHTML = "";

        kPlayers ? this.addPlayer(pTotal) : this.addPlayer(); 
    }
}

rollBtn.addEventListener("click", () => {
    gameState.roll();
});

holdBtn.addEventListener("click", () => {
    gameState.hold();
});

addPlrBtn.addEventListener("click", () => {
    gameState.addPlayer();
});

resetBtn.addEventListener("click", () => {
    if (!gameState.gameRunning) {
        gameState.reset();
    }
});

gameState.addPlayer();