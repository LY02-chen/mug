const songList = [
    {
        title: "Tempestissimo",
        difficult: [1, 2, 3, 4, 34, 1],
        tag: [""]
    },
    {
        title: "Don't Fight The Music",
        difficult: [0, 0, 0, 0, 36, 0],
        tag: [""]
    },
    {
        title: "the EmpErroR",
        difficult: [0, 0, 0, 0, 36, 0],
        tag: [""]
    },
    {
        title: "エンドマークに希望と涙を添えて",
        difficult: [0, 0, 0, 0, 35, 0],
        tag: [""]
    },
    {
        title: "マシンガンポエムドール",
        difficult: [0, 0, 0, 0, 34, 0],
        tag: [""]
    }
];

const path = (index) => {
    return `song_list/${songList[index].title}/`;
}

const songImage = Array.from({length: songList.length}, (x, index) => {
    const src = `${path(index)}image.jpg`;
    const texture = new THREE.TextureLoader().load(src);
    return new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });
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

const selectListGeometry = Array.from({length: songList.length}, (x, index) => {
    return Array.from({length: 6}, (x, difficult) => {
        const geometryArray = [
            new THREE.PlaneGeometry(selectListGeometryWidth, selectListGeometryHeight),
            new THREE.CircleGeometry(selectListDifficultRadius, 1024),
            new THREE.CircleGeometry(selectListDifficultRadius * 0.8, 1024),
            new THREE.PlaneGeometry(selectListLevelSize, selectListLevelSize),
            new THREE.PlaneGeometry(selectListImageSize, selectListImageSize),
            new THREE.PlaneGeometry(selectListTitleWidth, selectListTitleHeight),
        ];

        geometryArray[1].translate(-(selectListGeometryWidth - selectListGeometrySize(1)) / 2, 0, 0.1);
        geometryArray[2].translate(-(selectListGeometryWidth - selectListGeometrySize(1)) / 2, 0, 0.1);
        geometryArray[3].translate(-(selectListGeometryWidth - selectListGeometrySize(1)) / 2, 0, 0.1);
        geometryArray[4].translate(-(selectListGeometryWidth - selectListGeometrySize(2.7)) / 2, 0, 0);
        geometryArray[5].translate(-(selectListGeometryWidth - selectListGeometrySize(6.7)) / 2, 0, 0);
    
        const materialArray = [
            new THREE.MeshBasicMaterial({color: 0x39293d}),
            new THREE.MeshBasicMaterial({color: 0xffffff}),
            new THREE.MeshBasicMaterial({color: difficultColor[difficult]}),
            selectListLevel[songList[index].difficult[difficult]],
            songImage[index],
            selectListTitle[index]
        ];

        return new THREE.Mesh(
            THREE.BufferGeometryUtils.mergeBufferGeometries(
                geometryArray, true
            ), 
            materialArray
        );
    });
});
