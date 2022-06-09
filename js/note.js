const Note = {
    Note: function(scene, key, ticks, type) {
        const width = noteWidth * key.length,
              height = noteHeight,
              radius = noteRadius,
              initX = noteWidth * (key[0]) + width / 2,
              initY = ticks;

        const plane = new THREE.Mesh (
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: new THREE.CanvasTexture(
                    Note.noteImage(type, width, height, radius)
                ),
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
    noteImage: function(type, width, height, radius) {
        const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");

        const offset = noteOffset;

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
            ctx.translate(width - height * (offset * 2), size);
            ctx.rotate(Math.PI);
            drawSquare();
        }

        drawRect(
            width, height * (1 - offset), 
            radius, "bottom", 
            0, height * offset
        );
        drawRect(
            width, height * (1 - offset), 
            radius, "top", 
            0, 0
        );
        drawRect(
            width - height * (offset * 2), height * (1 - offset * 3), 
            radius * (1 - offset * 3), "mid", 
            height * offset, height * offset
        );
        drawSide(
            height * offset, radius * offset,
            height * offset, height * (0.5 - offset)
        );

        return canvas;
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