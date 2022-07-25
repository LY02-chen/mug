let renderAspect = 16 / 9,
    renderWidth = 800,
    renderHeight = renderWidth / renderAspect;

let selectListGeometrySize = (scale) => renderHeight * (renderAspect == 16 / 9 ? 0.14 : 0.105) * scale,
    selectListGeometryX = renderWidth * -0.2,
    selectListGeometryWidth = selectListGeometrySize(5),
    selectListGeometryHeight = selectListGeometrySize(1),
    selectListGeometryShowCount = Math.ceil(renderHeight / selectListGeometryHeight) + 1,
    selectListGeometryPadding = selectListGeometrySize(0.01),
    selectDifficultRadius = selectListGeometrySize(0.3),
    selectLevelSize = selectListGeometrySize(1),
    selectImageSize = selectListGeometrySize(0.7),
    selectTitleWidth = selectListGeometrySize(3),
    selectTitleHeight = selectListGeometrySize(1);

let selectSongSize = (scale) => renderHeight * (renderAspect == 16 / 9 ? 0.8 : 0.6) * scale,
    selectSongImageX = renderWidth * 0.25,
    selectDifficultX = renderWidth * 0.25 - selectSongSize(55 / 140),
    selectDifficultY = -selectSongSize(4 / 11),
    selectSongImageSize = selectSongSize(1),
    selectSongDifficultSize = selectSongSize(1 / 7),
    selectSongDifficultRadius = selectSongSize(1 / 14),
    selectSongDifficultPadding = selectSongSize(1 / 70);

const difficultColor = [
    0x00e60b,
    0x00e5e6,
    0xffbe33,
    0xff1a1a,
    0xa200ff,
    0x000000
];

const difficultText = [
    "Easy",
    "Normal",
    "Hard",
    "Expert",
    "Master",
    "Ultimate"
];

