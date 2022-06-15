const Game = {
    Init: function() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x5d5d5d);
        
        const camera = new THREE.PerspectiveCamera(
            45, 16 / 9, 0.1, 10000
        );
        camera.position.set(trackWidth / 2, cameraPos[0], cameraPos[1]);
        camera.lookAt(trackWidth / 2, cameraLook[0], cameraLook[1]);
        
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(canvasWidth, canvasHeight);
        document.getElementById("game").appendChild(renderer.domElement);

        return {
            scene: scene,
            camera: camera,
            renderer: renderer
        };
    },
    drawBackground: function(path) {
        const backgroundGroup = new THREE.Group();

        function drawLine(width, height, x, y, z, color) {
            const line = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height), 
                new THREE.MeshBasicMaterial({color: color})
            );
            line.position.set(x, y, z);
            backgroundGroup.add(line);
        }

        for (let i = 1; i < 8; i++) 
            drawLine(0.5, 4000, i * noteWidth, 1900, -0.2, 0x9d9d9d);
        drawLine(1, 4000, -0.5, 1900, -0.2, 0x9d9d9d);
        drawLine(1, 4000, trackWidth - 0.5, 1900, -0.2, 0x9d9d9d);

        drawLine(trackWidth, 2, trackWidth / 2, noteHeight / 2 - 1, -0.1, 0xbe77ff);
        drawLine(trackWidth, 2, trackWidth / 2, noteHeight / -2 + 1, -0.1, 0xbe77ff);
        drawLine(2, noteHeight, -0.5, 0, -0.1, 0xbe77ff);
        drawLine(2, noteHeight, trackWidth - 0.5, 0, -0.1, 0xbe77ff);

        const image = new THREE.Mesh(
            new THREE.PlaneGeometry(1500, 1500), 
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(`${path}image.jpg`)
            })
        );
        image.rotateX(cameraDegree);
        image.position.set(trackWidth / 2, 3000, -1000)
        backgroundGroup.add(image);
        
        const planeShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(5000, 5000), 
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.6
            })
        );
        planeShadow.rotateX(cameraDegree);
        planeShadow.position.set(trackWidth / 2, 2999, -999);
        backgroundGroup.add(planeShadow);

        return backgroundGroup;
    },
    gamePlay: function(song, difficult) {
        const canvas = new Game.Init();

        const path = `${songList[song].path}`,
              ms = `${path}${difficult}.ms`,
              audio = `${path}audio.mp3`;
    
        canvas.scene.add(Game.drawBackground(path));

        const notesInfo = Note.read(ms);
    
        const notesGroup = new THREE.Group();
    
        const notes = Array.from(
            {length: notesInfo.length},
            (x, index) => new Note.Note(notesGroup, notesInfo[index])
        );
    
        canvas.scene.add(notesGroup);

        let startTime = 0;

        const listener = new THREE.AudioListener();
        canvas.camera.add(listener);

        const sound = new THREE.Audio(listener);

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(audio , function(buffer) {
            sound.setBuffer(buffer);
            sound.setVolume(volume / 100);
            sound.play();
            startTime = Date.now();
            canvas.renderer.render(canvas.scene, canvas.camera);
            loop();
        });

        function loop() {
            const animate = requestAnimationFrame(loop);
    
            if (pause) {            
                cancelAnimationFrame(animate);
                sound.stop();
                document.getElementById("game").removeChild(canvas.renderer.domElement);
            }
        
            Game.down(notes, Date.now() - startTime);
    
            canvas.renderer.render(canvas.scene, canvas.camera);
        }
    },
    down: function(notes, time) {
        for(let i in notes) {
            notes[i].down(time);
        }
    }
};