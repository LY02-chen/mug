const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5d5d5d);
        
const camera = new THREE.PerspectiveCamera(
    45, 16 / 9, 0.1, 10000
);
camera.position.set(canvasWidth / 2, canvasHeight / 2, 1000);
camera.lookAt(canvasWidth / 2, canvasHeight / 2, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(canvasWidth, canvasHeight);
document.getElementById("game").appendChild(renderer.domElement);

const circle = new THREE.Mesh(
    new THREE.CircleGeometry(100, 32),
    new THREE.MeshBasicMaterial({color: 0xffffff})
);

const domEvent = new THREEx.DomEvents(camera, renderer.domElement);


domEvent.addEventListener(circle, "click", event => {
    console.log("click");
});

scene.add(circle);

circle.position.set(0, 0, 0);

renderer.render(scene, camera);