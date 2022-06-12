const Game = {
    Init: function() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x5b5b5b);
        
        const camera = new THREE.PerspectiveCamera(
            45, 16 / 9, 0.1, 2000
        );
        camera.position.set(trackWidth / 2, -120, 120);
        camera.lookAt(trackWidth / 2, 100, 0);
        
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(canvasWidth, canvasHeight);
        document.getElementById("game").appendChild(renderer.domElement);

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
        
        scene.add(backgroundGroup);

        return {
            scene: scene,
            camera: camera,
            renderer: renderer
        };
    },
    gamePlay: function(song, difficult) {
        const canvas = new Game.Init();
        const ms = `${songList[song].ms}${difficult}.ms`,
              audio = `${songList[song].audio}`;
    
        const notesInfo = Note.read(ms);
    
        const notesGroup = new THREE.Group();
    
        const notes = Array.from(
            {length: notesInfo.length},
            (x, index) => new Note.Note(notesGroup, notesInfo[index])
        );
    
        canvas.scene.add(notesGroup);

        let startTime = 0;

        const listener = new THREE.AudioListener();
        canvas.camera.add( listener );

        const sound = new THREE.Audio( listener );

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(audio , function( buffer ) {
            sound.setBuffer( buffer );
            sound.setVolume( volume / 100 );
            sound.play();
            startTime = Date.now();
            loop();
        });

        function loop() {
            const animate = requestAnimationFrame(loop);
    
            if (pause) {            
                cancelAnimationFrame( animate );
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