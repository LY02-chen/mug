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
    
const selectListFrame = new THREE.Mesh(
    new THREE.PlaneGeometry(selectGeometryWidth, selectGeometryHeight * 8),
    new THREE.MeshBasicMaterial({color: 0xffffff})
);
scene.add(selectListFrame);
selectListFrame.position.set(-renderWidth * 0.4, 0, -0.1);

const selectListGroup = new THREE.Group();
scene.add(selectListGroup);


function selectListLoad(selectList, difficult) {
    const selectLength = Math.ceil(11 / selectList.length) * selectList.length;
    
    selectListGroup.clear();
    for (let i = 0; i < selectLength; i++) {
        const geometry = selectGeometry[selectList[i % selectList.length]][difficult].clone();
               
        geometry.position.set(
            -renderWidth * 0.4, 
            -(selectGeometryPadding + selectGeometryHeight) * (selectLength - i < 5 ? i - selectLength : i), 
            0.1
        );
        selectListGroup.add(geometry);
    } 
}

function selectListSetting(tag, difficult, order) {
    const selectList = [0,1,2,3,4];

    selectListLoad(selectList, difficult);
}

selectListSetting("tag", 4, "order");


let listSlideMousePos = null;

domEvent.addEventListener(selectListFrame, "mousedown", event => {
    listSlideMousePos = event.intersect.point.y;
});

domEvent.addEventListener(selectListFrame, "mouseup", event => {
    listSlideMousePos = null;
});

domEvent.addEventListener(selectListFrame, "mouseout", event => {
    listSlideMousePos = null;
});

domEvent.addEventListener(selectListFrame, "mousemove", event => {
    if (listSlideMousePos) {
        const movey = event.intersect.point.y - listSlideMousePos;

        const selectistHeight = selectListGroup.children.length * (selectGeometryHeight + selectGeometryPadding);
        for (let children of selectListGroup.children) {
            children.position.y += movey;
            if (children.position.y >= (selectistHeight + selectGeometryPadding) / 2 + selectGeometryHeight) {
                children.position.y -= selectistHeight;
            }
            else if (children.position.y <= (selectistHeight + selectGeometryPadding) / -2 - selectGeometryHeight) {
                children.position.y += selectistHeight;
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