const renderWidth = 800,
      renderHeight = 450;

const selectGeometrySize = (scale) => renderHeight * 0.3 * scale,
      selectGeometryWidth = selectGeometrySize(5),
      selectGeometryHeight = selectGeometrySize(1),
      selectGeometryPadding = selectGeometrySize(0.01),
      selectDifficultRadius = selectGeometrySize(0.3),
      selectLevelSize = selectGeometrySize(1),
      selectImageSize = selectGeometrySize(0.7),
      selectTitleWidth = selectGeometrySize(3),
      selectTitleHeight = selectGeometrySize(1);

const difficultColor = [
    0x00e60b,
    0x00e5e6,
    0xffbe33,
    0xff1a1a,
    0xa200ff,
    0x000000
];

