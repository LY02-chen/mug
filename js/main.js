const gameCanvas = new Game.Init();

const rand = (n) => Math.floor(Math.random() * n)

const notes = Array.from(
    {length: 1000}, 
    (x, index) => {
        const length = rand(8) + 1;
        const left = rand(9 - length);
        const arr = Array.from({length: length}, (x, index) => left + index);
        return new Note.Note(gameCanvas.scene, arr, index * 20, "Normal");
    }
);
Game.gameLoop(gameCanvas, notes);
document.body.addEventListener("keydown", keyDown, false);

function keyDown(event) {    
}

