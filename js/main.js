const gameCanvas = new Game.Init();

const rand = (n) => Math.floor(Math.random() * n)

const notes = Array.from(
    {length: 1000}, 
    (x, index) => new Game.note(gameCanvas.scene, rand(8), index * 20)
);
Game.gameLoop(gameCanvas, notes);
document.body.addEventListener("keydown", keyDown, false);

function keyDown(event) {    
}