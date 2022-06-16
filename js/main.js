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

const show = new THREE.Mesh(
    new THREE.PlaneGeometry(canvasHeight * 1.2, canvasHeight * 1.2), 
    new THREE.MeshBasicMaterial()
);

scene.add(show);
show.position.set(canvasWidth / 2, 0, 0);

const songMenuList = [];
let songIndex = 1;

const domEvent = new THREEx.DomEvents(camera, renderer.domElement);

function songListPlane(width, height, y, imageSize) {
    width *= canvasWidth;
    height *= canvasHeight
    y *= canvasHeight;
    imageSize *= height;

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
          imageSize = 0.8;

    songListGroup.add(songListPlane(
        width * scale, height * scale,
        0, imageSize
    ));
    for (let i = 0; i < 3; i++) {
        songListGroup.add(songListPlane(
            width, height, 
            padding * (i + 1) + height * (scale / 2 + 0.5 + i),
            imageSize
        ));
        songListGroup.add(songListPlane(
            width, height, 
            -padding * (i + 1) - height * (scale / 2 + 0.5 + i),
            imageSize
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
    }

    changeSong();
}
songListPlanes();

function changeSong() {
    const song = songList[songIndex],
    path = `${song.path}`;
    
    show.material.map = new THREE.TextureLoader().load(`${path}image.jpg`);
    show.material.needsUpdate = true;

    for (let i = 0; i <= 6; i++) {
        const path = songList[(i % 2 ? 
            (songIndex - (i + 1) / 2 + songList.length - 2) : 
            (songIndex + i / 2 - 1)
        ) % (songList.length - 1) + 1].path;

        const mesh = songListGroup.children[i];
        mesh.material[1].map = new THREE.TextureLoader().load(`${path}image.jpg`);
    }
}

function loop() {
    const animate = requestAnimationFrame(loop);

    renderer.render(scene, camera);
}
loop();