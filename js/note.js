const Note = {
    Note: function(scene, key, ticks, type) {
        const width = noteWidth * key.length,
              height = noteHeight,
              radius = noteRadius,
              initX = noteWidth * (key[0]) + width / 2,
              initY = ticks;

        const plane = Note.noteImage(type, width, height, radius);

        plane.position.set(initX, initY, 0);
        scene.add(plane);

        this.down = function() {
            if(plane.position.y > -30) {
                plane.position.y -= speed;
            }
        }
    },
    noteImage: function(type, width, height, radius) {
        const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");

        const scale = 20;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);

        const color = Note.color[type];

        const grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, color["topStart"]);
        grd.addColorStop(1, color["topEnd"]);
        color["top"] = grd;

        function drawRect(width, height, radius, part, dx, dy) {
            ctx.fillStyle = color[part];

            ctx.translate(dx, dy);
            ctx.beginPath();
            ctx.arc(radius, radius, 
                    radius, Math.PI * 1, Math.PI * 1.5);
            ctx.lineTo(width - radius * 2, 0);
            ctx.arc(width - radius, radius, 
                    radius, Math.PI * 1.5, 0);
            ctx.lineTo(width, height - radius);
            ctx.arc(width - radius, height - radius, 
                    radius, 0, Math.PI * 0.5);
            ctx.lineTo(radius, height);
            ctx.arc(radius, height - radius, 
                    radius, Math.PI * 0.5, Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.translate(-dx, -dy);
        }

        function drawSide(size, radius, dx, dy) {
            ctx.fillStyle = color["side"];

            function drawSquare() {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(size - radius, 0);
                ctx.arc(size - radius, radius,
                        radius, Math.PI * 1.5, 0);
                ctx.lineTo(size, size);
                ctx.arc(size - radius, size - radius,
                        radius, 0, Math.PI * 0.5);
                ctx.lineTo(0, size);
                ctx.closePath();
                ctx.fill();
            }

            ctx.translate(dx, dy);
            drawSquare();
            ctx.translate(width - height * 0.3, size);

            ctx.rotate(Math.PI);
            drawSquare();

        }

        drawRect(
            width, height * 0.85, 
            radius, "bottom", 
            0, height * 0.15
        );

        drawRect(
            width, height * 0.85, 
            radius, "top", 
            0, 0
        );

        drawRect(
            width - height * 0.3, height * 0.55, 
            radius * 0.7, "mid", 
            height * 0.15, height * 0.15
        );

        drawSide(
            height * 0.25, radius * 0.25,
            height * 0.15, height * 0.3
        );

        return new THREE.Mesh (
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: new THREE.CanvasTexture(canvas),
                transparent: true
            })
        ); 
    },
    color: {
        "Normal": {
            "bottom": "#80ffff",
            "topStart": "#ca8eff",
            "topEnd": "#acd6ff",
            "mid": "#c4e1ff",
            "side": "#7d7dff",
        }
    }
}