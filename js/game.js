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
        const width = noteWidth * key.length,
              height = noteHeight,
              initX = noteWidth * (key[0] + 0.5),
              initY = ticks + 20;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        const texture = new THREE.CanvasTexture(canvas);

        const imageLeft = new Image();
        imageLeft.crossOrigin = "anonymous";
        imageLeft.onload = function() {
            ctx.drawImage(this, 0, 0, height, height);
            texture.needsUpdate = true;
        }
        imageLeft.src = "image/noteNormal/left.png";

        const imageRight = new Image();
        imageRight.crossOrigin = "anonymous";
        imageRight.onload = function() {
            ctx.drawImage(this, width - height, 0, height, height);
            texture.needsUpdate = true;
        }
        imageRight.src = "image/noteNormal/right.png";

        const imageMid = new Image();
        imageMid.crossOrigin = "anonymous";
        imageMid.onload = function() {
            for (let i = 0; i < 2 * (key.length - 1); i++) {
                ctx.drawImage(this, height + i * height, 0, height, height);
                texture.needsUpdate = true;
            }
        }
        imageMid.src = "image/noteNormal/mid.png";

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            })
        );
        
        plane.position.set(initX, initY, 0);
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