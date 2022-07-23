const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5d5d5d);
        
const camera = new THREE.PerspectiveCamera(
    45, 16 / 9, 0.1, 10000
);
camera.position.set(0, 0, 1000);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(renderWidth, renderHeight);
document.getElementById("game").appendChild(renderer.domElement);

const domEvent = new THREEx.DomEvents(camera, renderer.domElement);
    


const le = songList.length;
const dif = 4;

const Selgeometry = new THREE.Mesh(
    new THREE.PlaneGeometry(selectWidth, selectHeight * 8),
    new THREE.MeshBasicMaterial({color: 0xffffff})
);
scene.add(Selgeometry);
Selgeometry.position.set(-renderWidth * 0.45, 0, -0.1);

const selectSelectGroup = new THREE.Group();
scene.add(selectSelectGroup);


selectSelectGroup.clear();
for (let i = 0; i < le; i++) {
    const geometry = new THREE.Mesh(
        new THREE.PlaneGeometry(selectWidth, selectHeight),
        new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(
                songSelectCanvas[i][dif]
            )
        })
    );
    
    geometry.position.set(-renderWidth * 0.45, 
        -(selectPadding + selectHeight) * (le - i < 5 ? i - le : i), 
        0
    );
    selectSelectGroup.add(geometry);
} 







let listSlideMousePos = null;

domEvent.addEventListener(Selgeometry, "mousedown", event => {
    listSlideMousePos = event.intersect.point.y;
});

domEvent.addEventListener(Selgeometry, "mouseup", event => {
    listSlideMousePos = null;
});

domEvent.addEventListener(Selgeometry, "mouseout", event => {
    listSlideMousePos = null;
});

domEvent.addEventListener(Selgeometry, "mousemove", event => {
    if (listSlideMousePos) {
        const movey = event.intersect.point.y - listSlideMousePos;

        const listHeight = selectSelectGroup.children.length * (selectHeight + selectPadding);
        for (let children of selectSelectGroup.children) {
            children.position.y += movey;
            if (children.position.y >= (listHeight + selectPadding) / 2 + selectHeight) {
                children.position.y -= listHeight;
            }
            else if (children.position.y <= (listHeight + selectPadding) / -2 - selectHeight) {
                children.position.y += listHeight;
            }
        }

        listSlideMousePos = event.intersect.point.y;
    }
});

function loop() {
    const animate = requestAnimationFrame(loop);

    renderer.render(scene, camera);
}
loop();