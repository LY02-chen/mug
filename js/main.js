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
    new THREE.PlaneGeometry(500, 500), 
    new THREE.MeshBasicMaterial()
);

scene.add(show);
show.position.set(canvasWidth / 2, canvasHeight * 0.3, 0);


const songMenuList = [];
let songIndex = 1;
function changeSong() {
    const song = songList[songIndex],
    path = `${song.path}`;
    
    show.material.map = new THREE.TextureLoader().load(`${path}image.jpg`);
    show.material.needsUpdate= true;
    
    for (let i in songMenuList) {
        const plane = songMenuList[i];
        plane.position.set(-canvasWidth / 2, (i - songIndex + 1) * -150, 0);
    }
}

const domEvent = new THREEx.DomEvents(camera, renderer.domElement);

function songSel(num) {
    const song = songList[num],
          path = `${song.path}`;

    const texture = new THREE.TextureLoader().load(`${path}image.jpg`);

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(150, 150), 
        new THREE.MeshBasicMaterial({
            map: texture
        })
    );

    domEvent.addEventListener(plane, "click", event => {
        if (num == songIndex) 
            return; 
        songIndex = num;
        changeSong();
    });
    
    scene.add(plane);
    songMenuList.push(plane);
}

for (let i = 1; i < songList.length; i++) {
    songSel(i);
}
changeSong();

function loop() {
    const animate = requestAnimationFrame(loop);

    renderer.render(scene, camera);
}
loop();