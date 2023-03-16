const dieImage = document.getElementById("dieImage");
const playerContainer = document.getElementById("playerContainer");

const rollBtn = document.getElementById("rollBtn");
const holdBtn = document.getElementById("holdBtn");
const addPlrBtn = document.getElementById("addPlrBtn");

const gameState = {
    players: [],

    addPlayer() {
        this.players.push({ id: this.players.length + 1, score: 0, roll: 0, hold: false });

        const newPlayer = document.createElement("div");

        newPlayer.classList.add("playerBox");
        newPlayer.id = `p${this.players.length}`;
        newPlayer.innerHTML = `<h2>Player ${this.players.length}</h2>\n<h3>Score:</h3>`;

        playerContainer.appendChild(newPlayer);
    }
}

gameState.addPlayer();
gameState.addPlayer();
gameState.addPlayer();