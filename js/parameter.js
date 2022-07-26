let renderAspect = 16 / 12,
    renderWidth = 800,
    renderHeight = renderWidth / renderAspect;

let selectListGeometrySize = (scale) => renderHeight * (renderAspect == 16 / 9 ? 0.14 : 0.105) * scale,
    selectListGeometryX = renderWidth * -0.2,
    selectListGeometryWidth = selectListGeometrySize(5),
    selectListGeometryHeight = selectListGeometrySize(1),
    selectListGeometryShowCount = Math.ceil(renderHeight / selectListGeometryHeight) + 4,
    selectListGeometryPadding = selectListGeometrySize(0.01),
    selectListDifficultRadius = selectListGeometrySize(0.3),
    selectListLevelSize = selectListGeometrySize(1),
    selectListImageSize = selectListGeometrySize(0.7),
    selectListTitleWidth = selectListGeometrySize(3),
    selectListTitleHeight = selectListGeometrySize(1);

let selectSongSize = (scale) => renderHeight * (renderAspect == 16 / 9 ? 0.8 : 0.6) * scale,
    selectSongImageX = renderWidth * 0.25,
    selectSongBackgroundY = -selectSongSize(1.5),
    selectDifficultX = renderWidth * 0.25 - selectSongSize(55 / 140),
    selectDifficultY = -selectSongSize(55 / 140),
    selectSongImageSize = selectSongSize(1),
    selectSongBackgroundSize = selectSongSize(6),
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

let selectList = [];

let selectSongIndex = 2,
    selectDifficultIndex = 0,
    selectTag = "",
    selectOrder = "level-ascending";
