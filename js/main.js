const gameCanvas = new Game.Init();





function start() {
    const title = 0,
    difficult = "master",
    ms = `${songList[title].ms}${difficult}.ms`,
    audio = `${songList[title].audio}`;

    const notesInfo = Note.read(ms);

    const notesGroup = new THREE.Group();

    const notesList = Array.from(
        {length: notesInfo.length},
        (x, index) => new Note.Note(notesGroup, notesInfo[index])
    );
    
    gameCanvas.scene.add(notesGroup);

    Game.gamePlay(gameCanvas, notesList, audio);
}