const gameCanvas = new Game.Init();

const rand = (n) => Math.floor(Math.random() * n)

const noteType = ["Normal", "Up", "Down", "Long"];

const noteCount = 1000
const notesInfo = Array.from(
    {length: noteCount},
    (x, index) => {
        const start = rand(8);
        return {
            key: {start: start, length: rand(8 - start) + 1},
            ticks: {start: index * 30, end: 0},
            type: noteType[rand(4)],
            special: rand(10) < 3 ? true : false
        }
    }
);

const notesGroup = new THREE.Group();

const notesList = Array.from(
    {length: notesInfo.length},
    (x, index) => new Note.Note(notesGroup, notesInfo[index])
);

gameCanvas.scene.add(notesGroup);

Game.gameLoop(gameCanvas, notesList);
