const songList = [
    {
        title: "Tempestissimo",
        difficult: [1, 2, 3, 4, 34, 1]
    },
    {
        title: "Don't Fight The Music",
        difficult: [0, 0, 0, 0, 36, 0]
    },
    {
        title: "the EmpErroR",
        difficult: [0, 0, 0, 0, 36, 0]
    },
    {
        title: "エンドマークに希望と涙を添えて",
        difficult: [0, 0, 0, 0, 35, 0]
    },
    {
        title: "マシンガンポエムドール",
        difficult: [0, 0, 0, 0, 34, 0]
    }
];

const path = (index) => {
    return `song_list/${songList[index].title}/`;
}

const songImage = Array.from({length: songList.length}, (x, index) => {
    const src = `${path(index)}image.jpg`;
    return new THREE.TextureLoader().load(src);
});

const songAudioFull = Array.from({length: songList.length}, (x, index) => {
    const src = `${path(index)}audio-full.mp3`;
});

const songAudioPreview = Array.from({length: songList.length}, (x, index) => {
    const src = `${path(index)}audio-preview.mp3`;
});

const selectListLevel = Array.from({length: 101}, (x, level) => {
    const canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");
    canvas.width = renderHeight;
    canvas.height = renderHeight;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = `bold ${canvas.height * 0.2}pt Arial`;
    ctx.fillText(`${level}`, canvas.width / 2, canvas.height / 2);
    return new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true
    });
});

const selectListTitle = Array.from({length: songList.length}, (x, index) => {
    const canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");
    canvas.width = renderHeight * 3;
    canvas.height = renderHeight;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = `bold ${canvas.height * 0.14}pt Arial`;
    ctx.fillText(`${songList[index].title}`, 0, canvas.height / 2);
    return new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true
    });
});

const selectGeometry = Array.from({length: songList.length}, (x, index) => {
    return Array.from({length: 6}, (x, difficult) => {
        const geometryArray = [
            new THREE.PlaneGeometry(selectGeometryWidth, selectGeometryHeight),
            new THREE.CircleGeometry(selectDifficultRadius, 1024),
            new THREE.CircleGeometry(selectDifficultRadius * 0.8, 1024),
            new THREE.PlaneGeometry(selectLevelSize, selectLevelSize),
            new THREE.PlaneGeometry(selectImageSize, selectImageSize),
            new THREE.PlaneGeometry(selectTitleWidth, selectTitleHeight),
        ];

        geometryArray[1].translate(-(selectGeometryWidth - selectGeometrySize(1)) / 2, 0, 0);
        geometryArray[2].translate(-(selectGeometryWidth - selectGeometrySize(1)) / 2, 0, 0);
        geometryArray[3].translate(-(selectGeometryWidth - selectGeometrySize(1)) / 2, 0, 0);
        geometryArray[4].translate(-(selectGeometryWidth - selectGeometrySize(2.7)) / 2, 0, 0);
        geometryArray[5].translate(-(selectGeometryWidth - selectGeometrySize(6.7)) / 2, 0, 0);
    
        const materialArray = [
            new THREE.MeshBasicMaterial({color: 0x39293d}),
            new THREE.MeshBasicMaterial({color: 0xffffff}),
            new THREE.MeshBasicMaterial({color: difficultColor[difficult]}),
            selectListLevel[songList[index].difficult[difficult]],
            new THREE.MeshBasicMaterial({
                map: songImage[index],
                transparent: true
            }),
            selectListTitle[index]
        ];

        const bufferGeometry = new THREE.Mesh(
            THREE.BufferGeometryUtils.mergeBufferGeometries(
                geometryArray, true
            ), 
            materialArray
        );

        return bufferGeometry;
    });
});
