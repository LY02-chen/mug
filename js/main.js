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

const axis = new THREE.AxesHelper(10000);
scene.add(axis);





function songSelectPlane(width, height, y) {
    width *= renderWidth;
    height *= renderHeight
    y *= renderHeight;

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

    const bufferGeometry = new THREE.Mesh(
        THREE.BufferGeometryUtils.mergeBufferGeometries(
            geometryArray, true
        ), 
        materialArray
    );
    bufferGeometry.position.set(-renderWidth * 0.45, -y, 0);

    return bufferGeometry;
}

const domEvent = new THREEx.DomEvents(camera, renderer.domElement);

const songSelectGroup = new THREE.Group();

let slideMousePos = null;

function songSelect() {
    const width = 0.7,
          height = 0.25,
          padding = 0.01;

    for (let i = 0; i < 10; i++) {
        songSelectGroup.add(songSelectPlane(
            width, height, 
            padding * i + height * i
        ));

        domEvent.addEventListener(songSelectGroup.children[i], "mousedown", event => {
            slideMousePos = event.intersect.point.y;
        });

        domEvent.addEventListener(songSelectGroup.children[i], "mouseup", event => {
            slideMousePos = null;
        });

        domEvent.addEventListener(songSelectGroup.children[i], "mouseout", event => {
            slideMousePos = null;
        });

        domEvent.addEventListener(songSelectGroup.children[i], "mousemove", event => {
            if (slideMousePos) {
                for (let i = 0; i < 10; i++) {
                    songSelectGroup.children[i].position.y += event.intersect.point.y - slideMousePos;
    
                }
                slideMousePos = event.intersect.point.y;
            }
        });


        
    }

    scene.add(songSelectGroup);
}
songSelect();


function loop() {
    const animate = requestAnimationFrame(loop);

    renderer.render(scene, camera);
}
loop();