const domEvent = new THREEx.DomEvents(camera, renderer.domElement);

const selectListGroup = new THREE.Group();
scene.add(selectListGroup);



function selectListSetting(tag, difficult, order) {
    selectList = songList.filter(song => song.tag.indexOf(tag) > -1);
    
    if (order == "level-ascending") {
        selectList.sort((a, b) => a.difficult[difficult] - b.difficult[difficult]);
    }
    else if (order == "level-descending") {
        selectList.sort((a, b) => b.difficult[difficult] - a.difficult[difficult]);
    }
    else if (order == "name-ascending") {
        selectList.sort();
    }
    else if (order == "name-descending") {
        selectList.sort().reverse();
    }

    selectList = selectList.map(song => songList.indexOf(song));

    if (selectList.indexOf(selectSongIndex) == -1) {
        selectSongIndex = selectList[0];
    } 
    while (selectList.indexOf(selectSongIndex) > 0) {
        selectList.push(selectList.shift());
    }

    selectListGroup.clear();
    
    const selectListLength = Math.ceil(selectListGeometryShowCount / selectList.length) * selectList.length;
    
    for (let i = 0; i < selectListLength; i++) {
        const index = selectList[i % selectList.length];
        const geometry = selectListGeometry[index][difficult].clone();
               
        geometry.position.set(
            selectListGeometryX, 
            -(selectListGeometryPadding + selectListGeometryHeight) * (selectListLength - i < selectListGeometryShowCount / 2 ? i - selectListLength : i), 
            0.1
        );
        selectListGroup.add(geometry);
    }
}

selectListSetting(selectTag, 4, selectOrder);

const selectListFrame = new THREE.Mesh(
    new THREE.PlaneGeometry(
        selectListGeometryWidth, 
        selectListGeometryHeight * selectListGeometryShowCount
    ),
    new THREE.MeshBasicMaterial({color: 0xffffff})
);
selectListFrame.position.set(selectListGeometryX, 0, 0);
scene.add(selectListFrame);

const selectListHighlight = new THREE.Mesh(
    new THREE.PlaneGeometry(selectListGeometryWidth, selectListGeometryHeight),
    new THREE.MeshBasicMaterial({color: 0xcc0066})
);
selectListHighlight.position.set(selectListGeometryX, 0, 0.1);
scene.add(selectListHighlight);


const selectSongGroup = new THREE.Group();
scene.add(selectSongGroup);

const selectSongImage = new THREE.Mesh(
    new THREE.PlaneGeometry(selectSongImageSize, selectSongImageSize),
    songImage[selectSongIndex]
);
selectSongImage.position.set(selectSongImageX, 0, 0);
selectSongGroup.add(selectSongImage);

const selectSongBackground = new THREE.Mesh(
    new THREE.PlaneGeometry(selectSongBackgroundSize, selectSongBackgroundSize),
    songImage[selectSongIndex]
);
selectSongBackground.position.set(0, selectSongBackgroundY, -10);
selectSongGroup.add(selectSongBackground);

const selectSongBackgroundShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(renderWidth * 1.2, renderHeight * 1.2),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4
    })
);
selectSongBackgroundShadow.position.set(0, 0, -10);
selectSongGroup.add(selectSongBackgroundShadow);

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
        selectDifficultY, 0.1);
    selectSongGroup.add(geometry);

    domEvent.addEventListener(geometry, "click", event => {
        selectListSetting(selectTag, difficult, selectOrder);
    });
}



let selectListSlideMousePos = null;

domEvent.addEventListener(selectListFrame, "mousedown", event => {
    selectListSlideMousePos = event.intersect.point.y;
});

domEvent.addEventListener(selectListFrame, "mousemove", event => {
    if (selectListSlideMousePos) {
        selectListHighlight.scale.y = 0.05;
        selectListHighlight.position.z = 0.2;
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
        if (children.position.y == 0) {
            const index = selectListGroup.children.indexOf(children) % selectList.length;
            selectSongIndex = selectList[index];
            selectSongImage.material = songImage[selectSongIndex];
            selectSongBackground.material = songImage[selectSongIndex];
        }
    }
    selectListHighlight.scale.y = 1;
    selectListHighlight.position.z = 0.1;
}

domEvent.addEventListener(selectListFrame, "mouseup", event => {
    selectListSlideStop();
});

domEvent.addEventListener(selectListFrame, "mouseout", event => {
    selectListSlideStop();
});

