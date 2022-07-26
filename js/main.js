const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5d5d5d);

const camera = new THREE.PerspectiveCamera(
    Math.atan(renderHeight / 2000) / Math.PI * 360, 
    renderAspect, 
    0.1, 10000
);
camera.position.set(0, 0, 1000);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(renderWidth, renderHeight);
document.getElementById("game").appendChild(renderer.domElement);
renderer.setPixelRatio(2);


function loop() {
    const animate = requestAnimationFrame(loop);

    renderer.render(scene, camera);
}
loop();