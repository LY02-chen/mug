const gameCanvas = new Game.Init();

const title = "0001",
      difficult = "master",
      path = `musicalScore/${title}/${difficult}.ms`;

const notesInfo = Note.read(path);

const notesGroup = new THREE.Group();

const notesList = Array.from(
    {length: notesInfo.length},
    (x, index) => new Note.Note(notesGroup, notesInfo[index])
);

gameCanvas.scene.add(notesGroup);

Game.gameLoop(gameCanvas, notesList);