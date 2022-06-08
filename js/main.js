const gameCanvas = new Game.Init();

const rand = (n) => Math.floor(Math.random() * n)

const notes = Array.from(
    {length: 1000}, 
    (x, index) => new Game.note(gameCanvas.scene, [rand(8)], index * 20)
    // (x, index) => new Game.note(gameCanvas.scene, [index/8], Math.floor(index / 8))
);
Game.gameLoop(gameCanvas, notes);
document.body.addEventListener("keydown", keyDown, false);

function keyDown(event) {    
}