const Game = {
    Init: function() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x5b5b5b);
        
        const camera = new THREE.PerspectiveCamera(
            45, 16 / 9, 0.1, 2000
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
        const initY = ticks;
        const width = noteWidth,
              height = noteHeight,
              radius = noteRadius;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(24, 12),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("image/noteNormal.png"),
                transparent: true,
                opacity: 1
            })
        );
        
        plane.position.set(12 + key * 24,initY,0);
        scene.add(plane);

        this.down = function() {
            if(plane.position.y > -30) {
                plane.position.y -= speed;
            }
        }
    
    },
    down: function(notes) {
        for(let i in notes) {
            notes[i].down();
        }
    }
};