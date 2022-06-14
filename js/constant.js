const cameraPos = [-120, 120],
      cameraLook = [100, 0],
      cameraDegree = Math.PI / 2 - Math.atan(
        Math.abs(cameraPos[1] - cameraLook[1]) / 
        Math.abs(cameraPos[0] - cameraLook[0])
      ),
      canvasWidth = 800,
      canvasHeight = 450,
      noteWidth = 24,
      noteHeight = 16,
      noteRadius = 2,
      noteOffset = 0.1,
      canvasScale = 20,
      keyCount = 8,
      trackWidth = noteWidth * keyCount;

let speed = 12,
    volume = 50;

let pause = false;

