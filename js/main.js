const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5d5d5d);
        
const camera = new THREE.PerspectiveCamera(
    45, 16 / 9, 0.1, 10000
);
camera.position.set(0, 0, 1000);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(canvasWidth, canvasHeight);
document.getElementById("game").appendChild(renderer.domElement);

const axis = new THREE.AxesHelper(10000);
scene.add(axis);

const songPath = Array.from({length: songList.length}, (x, index) => {
    return songList[index].path;
});

const songImage = songPath.map(path => {
    return new THREE.TextureLoader().load(`${path}image.jpg`);
});

const show = new THREE.Mesh(
    new THREE.PlaneGeometry(canvasHeight * 1.2, canvasHeight * 1.2), 
    new THREE.MeshBasicMaterial()
);

scene.add(show);
show.position.set(canvasWidth / 2, 0, 0);

const levelCanvas = Array.from({length: 101}, (x, index) => {
    const canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");

    canvas.width = canvasHeight;
    canvas.height = canvasHeight;

    const textWidth = ctx.measureText(`${index + 1}`).width;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";

    ctx.font = "bold 60pt Arial";
    ctx.fillText(`LEVEL`, (canvas.width - textWidth) / 2, canvas.height / 4);
    ctx.font = "bold 100pt Arial";
    ctx.fillText(`${index}`, (canvas.width - textWidth) / 2, canvas.height / 2);

    return canvas;
});

document.body.appendChild(levelCanvas[1]);

const songMenuList = [];
let songIndex = 1,
    difficultIndex = 4;

const domEvent = new THREEx.DomEvents(camera, renderer.domElement);

function songListPlane(width, height, y, levelSize, imageSize) {
    width *= canvasWidth;
    height *= canvasHeight
    y *= canvasHeight;
    imageSize *= height;
    levelSize *= height;

    const geometryArray = [],
          materialArray = [];

    function addGeometry(geomatry, material) {
        geometryArray.push(geomatry);
        materialArray.push(material);
    }

    addGeometry(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial()
    );

    const levelCircle = new THREE.CircleGeometry(levelSize / 2, 32);
    levelCircle.translate(-(width - height * 0.8) / 2, 0, 0);
    addGeometry(
        levelCircle,
        new THREE.MeshBasicMaterial({color: 0x2d3e53})
    );

    const levelPlane = new THREE.PlaneGeometry(height, height);
    levelPlane.translate(-(width - height * 0.8) / 2, 0, 0);
    addGeometry(
        levelPlane,
        new THREE.MeshBasicMaterial({transparent: true})
    );

    const imagePlane = new THREE.PlaneGeometry(imageSize, imageSize);
    imagePlane.translate(-(width - height * 2.4) / 2, 0, 0);
    addGeometry(
        imagePlane,
        new THREE.MeshBasicMaterial()
    );

    const bufferGeometry = new THREE.Mesh(
        THREE.BufferGeometryUtils.mergeBufferGeometries(
            geometryArray, true
        ), 
        materialArray
    );
    bufferGeometry.position.set(-canvasWidth * 0.45, y, 0);

    return bufferGeometry;
}

const songListGroup = new THREE.Group();

function songListPlanes() {
    const width = 0.7,
          height = 0.25,
          scale = 1.2,
          padding = 0.05,
          imageSize = 0.8,
          levelSize = 0.6;

    songListGroup.add(songListPlane(
        width * scale, height * scale,
        0, levelSize, imageSize
    ));
    for (let i = 0; i < 3; i++) {
        songListGroup.add(songListPlane(
            width, height, 
            padding * (i + 1) + height * (scale / 2 + 0.5 + i),
            levelSize, imageSize
        ));
        songListGroup.add(songListPlane(
            width, height, 
            -padding * (i + 1) - height * (scale / 2 + 0.5 + i),
            levelSize, imageSize
        ));
    }

    scene.add(songListGroup);


    for (let i = 0; i <= 6; i++) {
        domEvent.addEventListener(songListGroup.children[i], "click", event => {
            songIndex = (i % 2 ? 
                (songIndex - (i + 1) / 2 + songList.length - 2) : 
                (songIndex + i / 2 - 1)
            ) % (songList.length - 1) + 1;

            changeSong();
        });
        songListGroup.children[i].material[0].color = 
            new THREE.Color(i == 0 ? 0xff99f5 : 0x39293d);
    }

    changeSong();
}
songListPlanes();


function changeSong() {
    show.material.map = songImage[songIndex];
    show.material.needsUpdate = true;

    for (let i = 0; i <= 6; i++) {
        const index = (i % 2 ? 
                (songIndex - (i + 1) / 2 + songList.length - 2) : 
                (songIndex + i / 2 - 1)
              ) % (songList.length - 1) + 1;

        const mesh = songListGroup.children[i];

        mesh.material[2].map = new THREE.CanvasTexture(
            levelCanvas[songList[index].difficult[difficultIndex]]
        );
        mesh.material[3].map = songImage[index];
    }
}

function loop() {
    const animate = requestAnimationFrame(loop);

    renderer.render(scene, camera);
}
loop();