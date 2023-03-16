const dieImage = document.getElementById("dieImage");
const playerContainer = document.getElementById("playerContainer");

const rollBtn = document.getElementById("rollBtn");
const holdBtn = document.getElementById("holdBtn");
const addPlrBtn = document.getElementById("addPlrBtn");
const resetBtn = document.getElementById("resetBtn");

const gameState = {
    players: [],
    gameRunning: false,
    currentPlayer: 0,

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
        }
    },

    roll() {
        let dieRoll = Math.ceil(Math.random() * 6);
        console.log(`Player ${this.currentPlayer + 1} rolled: ${dieRoll}`);

        this.gameRunning = true;
        
        if (dieRoll > 1) {
            this.players[this.currentPlayer].score += dieRoll;
        } else {
            this.players[this.currentPlayer].out = true;
            document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h4").textContent = "Out";
        }

        document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h3").textContent = `Score: ${this.players[this.currentPlayer].score}`;

        console.log(`Player ${this.currentPlayer + 1} score: ${this.players[this.currentPlayer].score}`);
        if (this.players[this.currentPlayer].score >= 20) {
            this.win();
        } else {
            this.nextTurn();
        }

        let pCount = this.players.length;
        this.players.forEach((player) => {
            if (player.out || player.hold) { pCount--; }
        });
        console.log(`remaining players: ${pCount}`);

        if (pCount === 1 && this.players.length > 1) {
            this.win();
        } else if (pCount === 0) {
            this.lose();
        }
    },

    hold() {
        this.players[this.currentPlayer].hold = true;
    },

    nextTurn(){
        let nextPlayer = this.currentPlayer + 1;
        let recheck = false;

        do {
            if (this.players[nextPlayer]) {
                if (!this.players[nextPlayer].hold && !this.players[nextPlayer].out) {
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
    },

    win() {
        alert(`Player ${this.currentPlayer + 1} has won the game!`);
        this.reset(true);
    },

    lose() {
        alert(`You have lost the game!`);
        this.reset(true);
    },

    reset(kPlayers = false) {
        let pCount = this.players.length;
        
        this.gameRunning = false;
        this.players = [];
        this.currentPlayer = 0;

        playerContainer.innerHTML = "";

        kPlayers ? this.addPlayer(pCount) : this.addPlayer(); 
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