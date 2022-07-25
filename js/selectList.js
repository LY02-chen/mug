const domEvent = new THREEx.DomEvents(camera, renderer.domElement);

const selectListGroup = new THREE.Group();
scene.add(selectListGroup);


function selectListLoad(selectList, difficult) {
    const selectLength = Math.ceil(selectListGeometryShowCount / selectList.length) * selectList.length;
    
    selectListGroup.clear();
    for (let i = 0; i < selectLength; i++) {
        const index = selectList[i % selectList.length];
        const geometry = selectListGeometry[index][difficult].clone();
               
        geometry.position.set(
            selectListGeometryX, 
            -(selectListGeometryPadding + selectListGeometryHeight) * (selectLength - i < selectListGeometryShowCount / 2 ? i - selectLength : i), 
            0.1
        );
        selectListGroup.add(geometry);

        domEvent.addEventListener(geometry, "click", event => {
            console.log(songList[index].title)
        });
    } 
}

function selectListSetting(tag, difficult, order) {
    const selectList = [0,1,2,3,4];

    selectListLoad(selectList, difficult);
}

selectListSetting("tag", 4, "order");

const selectListFrame = new THREE.Mesh(
    new THREE.PlaneGeometry(
        selectListGeometryWidth, 
        selectListGeometryHeight * selectListGeometryShowCount
    ),
    new THREE.MeshBasicMaterial({color: 0xffffff})
);
selectListFrame.position.set(selectListGeometryX, 0, 0);
scene.add(selectListFrame);

    
let selectListSlideMousePos = null;

domEvent.addEventListener(selectListFrame, "mousedown", event => {
    selectListSlideMousePos = event.intersect.point.y;
});

domEvent.addEventListener(selectListFrame, "mousemove", event => {
    if (selectListSlideMousePos) {
        const movey = event.intersect.point.y - selectListSlideMousePos;

        const selectListHeight = selectListGroup.children.length * (selectListGeometryHeight + selectListGeometryPadding);
        for (let children of selectListGroup.children) {
            children.position.y += movey;
            if (children.position.y >= (selectListHeight + selectListGeometryPadding) / 2 + selectListGeometryHeight) {
                children.position.y -= selectListHeight;
            }
            else if (children.position.y <= (selectListHeight + selectListGeometryPadding) / -2 - selectListGeometryHeight) {
                children.position.y += selectListHeight;
            }
        }

        selectListSlideMousePos = event.intersect.point.y;
    }
});

function selectListSlideStop() {
    selectListSlideMousePos = null;
    let fix = selectListGeometryHeight;
    for (let children of selectListGroup.children) {
        if (Math.abs(children.position.y) < Math.abs(fix)) {
            fix = children.position.y;
        }
    }
    const selectListHeight = selectListGroup.children.length * (selectListGeometryHeight + selectListGeometryPadding);
    for (let children of selectListGroup.children) {
        children.position.y -= fix;
        if (children.position.y >= (selectListHeight + selectListGeometryPadding) / 2 + selectListGeometryHeight) {
            children.position.y -= selectListHeight;
        }
        else if (children.position.y <= (selectListHeight + selectListGeometryPadding) / -2 - selectListGeometryHeight) {
            children.position.y += selectListHeight;
        }
    }
}

domEvent.addEventListener(selectListFrame, "mouseup", event => {
    selectListSlideStop();
});

domEvent.addEventListener(selectListFrame, "mouseout", event => {
    selectListSlideStop();
});



const selectSongGroup = new THREE.Group();
scene.add(selectSongGroup);

const selectSongImage = new THREE.Mesh(
    new THREE.PlaneGeometry(selectSongImageSize, selectSongImageSize),
    new THREE.MeshBasicMaterial({color: 0x393939})
);
selectSongImage.position.set(selectSongImageX, 0, 0);
selectSongGroup.add(selectSongImage);

function selectSongDifficult(difficult) {
    const canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");
    canvas.width = renderHeight;
    canvas.height = renderHeight;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = `bold ${canvas.height * 0.2}pt Arial`;
    ctx.fillText(`${difficultText[difficult]}`, canvas.width / 2, canvas.height / 2);

    const geometryArray = [
        new THREE.CircleGeometry(selectSongDifficultRadius, 1024),
        new THREE.CircleGeometry(selectSongDifficultRadius * 0.8, 1024),
        new THREE.PlaneGeometry(selectSongDifficultSize, selectSongDifficultSize)
    ];

    const materialArray = [
        new THREE.MeshBasicMaterial({color: 0xffffff}),
        new THREE.MeshBasicMaterial({color: difficultColor[difficult]}),
        new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(canvas),
            transparent: true
        })
    ];

    return new THREE.Mesh(
        THREE.BufferGeometryUtils.mergeBufferGeometries(
            geometryArray, true
        ), 
        materialArray
    );
}

for (let difficult in difficultColor) {
    const geometry = selectSongDifficult(difficult);
    geometry.position.set(
        selectDifficultX + (selectSongDifficultRadius * 2 + selectSongDifficultPadding) * difficult, 
        selectDifficultY, 0);
    selectSongGroup.add(geometry);
}
