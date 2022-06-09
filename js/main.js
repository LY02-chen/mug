const gameCanvas = new Game.Init();

const notesInfo = Note.read(0, "0001", "master");

const notesGroup = new THREE.Group();

const notesList = Array.from(
    {length: notesInfo.length},
    (x, index) => new Note.Note(notesGroup, notesInfo[index])
);

gameCanvas.scene.add(notesGroup);

Game.gameLoop(gameCanvas, notesList);