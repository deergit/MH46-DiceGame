const dieImage = document.getElementById("dieImage");
const playerContainer = document.getElementById("playerContainer");

const rollBtn = document.getElementById("rollBtn");
const holdBtn = document.getElementById("holdBtn");
const addPlrBtn = document.getElementById("addPlrBtn");

const gameState = {
    players: [],
    gameRunning: false,
    currentPlayer: 0,

    addPlayer() {
        if (!this.gameRunning) {
            this.players.push({ id: this.players.length + 1, score: 0, roll: 0, hold: false, out: false });

            const newPlayer = document.createElement("div");

            newPlayer.classList.add("playerBox");
            newPlayer.id = `p${this.players.length}`;
            newPlayer.innerHTML = `<h2>Player ${this.players.length}</h2>\n<h3>Score: 0</h3>\n<h4>In</h4>`;

            playerContainer.appendChild(newPlayer);
        }
    },

    roll() {
        let dieRoll = Math.ceil(Math.random() * 6);

        this.gameRunning = true;
        
        if (dieRoll > 1) {
            this.players[this.currentPlayer].score += dieRoll;
        } else {
            this.players[this.currentPlayer].out = true;document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h4").textContent = "Out";
        }

        document.getElementById(`p${this.currentPlayer + 1}`).querySelector("h3").textContent = `Score: ${this.players[this.currentPlayer].score}`;

        let nextPlayer = this.currentPlayer + 1;
        let recheck = false;

        if (this.players[this.currentPlayer].score >= 20) {
            this.win();
        } else {
            do {
                if (!this.players[nextPlayer]) {
                    this.currentPlayer = 0;
                } else if (!this.players[nextPlayer].hold && !this.players[nextPlayer].out) {
                    this.players[nextPlayer] ? this.currentPlayer = nextPlayer : this.currentPlayer = 0;
                    recheck = false;
                } else {
                    nextPlayer++;
                    recheck = true;
                }
            } while (recheck);
        }

        let pCount = this.players.length;
        this.players.forEach((player) => {
            if (player.out || player.hold) { pCount--; }
        });

        if (pCount === 0) {
            this.lose();
        }
        console.log(`Roll: ${dieRoll}`);
        console.log(`Player ${this.currentPlayer + 1} score: ${this.players[this.currentPlayer].score}`);
    },

    hold() {
        this.players[this.currentPlayer].hold = true;
    },

    win() {
        alert(`Player ${this.currentPlayer + 1} has won the game!`);
        this.reset();
    },

    lose() {
        alert(`You have lost the game!`);
        this.reset();
    },

    reset() {
        this.gameRunning = false;
        this.players = [];
        this.currentPlayer = 0;

        playerContainer.innerHTML = "";

        this.addPlayer();
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

gameState.addPlayer();