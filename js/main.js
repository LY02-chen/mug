const gameCanvas = new Game.Init();

const rand = (n) => Math.floor(Math.random() * n)

const notes = Array.from(
    {length: 1}, 
    (x, index) => new Game.note(gameCanvas.scene, index % 8, Math.floor(index / 8))
);
Game.gameLoop(gameCanvas, notes);
document.body.addEventListener("keydown", keyDown, false);

function keyDown(event) {    
}