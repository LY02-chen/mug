const Game = {
    Init: function() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x5b5b5b);
        
        const camera = new THREE.PerspectiveCamera(
            45, 16 / 9, 0.1, 10000
        );
        camera.position.set(trackWidth / 2, -120, 100);
        camera.lookAt(trackWidth / 2, 120, 0);
        
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(canvasWidth, canvasHeight);
        document.getElementById("game").appendChild(renderer.domElement);
        
        function drawLine(width, height, x, y, z, color) {
            const line = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height), 
                new THREE.MeshBasicMaterial({color: color})
            );
            line.position.set(x, y, z);
            scene.add(line);
        }

        for (let i = 1; i < 8; i++) 
            drawLine(0.5, 4000, i * noteWidth, 1900, -0.1, 0x9d9d9d);
        drawLine(1, 4000, -0.5, 1900, -0.1, 0x9d9d9d);
        drawLine(1, 4000, trackWidth - 0.5, 1900, -0.1, 0x9d9d9d);

        drawLine(trackWidth, 2, trackWidth / 2, noteHeight / 2 - 1, -0.09, 0xbe77ff);
        drawLine(trackWidth, 2, trackWidth / 2, noteHeight / -2 + 1, -0.09, 0xbe77ff);
        drawLine(2, noteHeight, -0.5, 0, -0.09, 0xbe77ff);
        drawLine(2, noteHeight, trackWidth - 0.5, 0, -0.09, 0xbe77ff);
        
        return {
            scene: scene,
            camera: camera,
            renderer: renderer
        };
    },
    gameLoop: function(canvas, notes) {
        function loop() {
            const animate = requestAnimationFrame(loop);
    
            if (false) {            
                console.log(scene);
                console.log(renderer);
                cancelAnimationFrame( id );
                document.getElementById("canvas").remove(renderer.domElement);
            }
            
            Game.down(notes);
    
            canvas.renderer.render(canvas.scene, canvas.camera);
        }
        loop();
    },
    note: function(scene, key, ticks) {
        const shape = new THREE.Shape();
        shape.arc(noteRadius, noteRadius - noteHeight / 2, 
                  noteRadius, Math.PI, Math.PI * 1.5);
        shape.arc(noteWidth - 2 * noteRadius, noteRadius, 
                  noteRadius, Math.PI * 1.5, Math.PI * 2);
        shape.arc(-noteRadius, noteHeight - 2 * noteRadius, 
                  noteRadius, 0, Math.PI * 0.5);
        shape.arc(-noteWidth + 2 * noteRadius, -noteRadius, 
                  noteRadius, Math.PI * 0.5, Math.PI);
        
        const extrudeSettings = {
            steps: 1,
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 2,
            bevelOffset: -2,
            bevelSegments: 4
        };

        const note = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape, extrudeSettings),
            new THREE.MeshMatcapMaterial({color: 0x4dffff})
        );

        const initY = ticks;

        note.position.set(noteWidth * key, ticks ,0);
        scene.add(note);
        
    
        this.down = function() {
            if(note.position.y > -10) {
                note.position.y -= speed;
            }
        }
    
        this.plane = function() {
            return note;
        }
    },
    down: function(notes) {
        for(let i in notes) {
            notes[i].down();
        }
    }
};
    
//     const notes = [];
//     for (let i = 0; i < 8; i++) {
//         notes.push(new note(i));
//     }