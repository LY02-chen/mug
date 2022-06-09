const Note = {
    // new Note.Note(
    //     group = notes, 
    //     noteInfo: {
    //         key: {start: int, length: int},
    //         ticks: {start: float, end: float},
    //         type: "Normal" / "Up" / "Down" / "Long",
    //         special: true/ false
    //     }
    // )
    Note: function(group, noteInfo) {
        const key = noteInfo.key,
              ticks = noteInfo.ticks,
              type = noteInfo.type,
              special = noteInfo.special;

        const initX = noteWidth * (key.start + key.length / 2),
              startY = ticks.start,
              endY = ticks.end;

        const noteGeometry = Note.drawNote(key.length, type, special);

        noteGeometry.position.set(initX, startY, 0);
        group.add(noteGeometry);

        this.down = function() {
            if (noteGeometry.position.y > -40) {
                noteGeometry.position.y -= speed;
            }
        }
    },
    drawNote: function(length, type, special) {
        const width = noteWidth * length,
              height = noteHeight,
              radius = noteRadius;

        const notePlane = new THREE.Mesh (
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: new THREE.CanvasTexture(
                    Note.noteImage(type, special, width, height, radius)
                ),
                transparent: true
            })
        ); 

        return notePlane;
    },
    noteImage: function(type, special, width, height, radius) {
        const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");

        const offset = noteOffset;

        const scale = 20;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);

        const color = special ? Note.color["Special"] : Note.color[type];

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
            height / 5, radius / 5,
            height * offset, height * (0.8 - offset) / 2
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
        },
        "Up": {
            "bottom": "#ffb6c1",
            "topStart": "#de6890",
            "topEnd": "#eca7be",
            "mid": "#ffd9ec",
            "side": "#d56767",
        },
        "Down": {
            "bottom": "#acd6ff",
            "topStart": "#0066cc",
            "topEnd": "#66b3ff",
            "mid": "#66b3ff",
            "side": "#2e2eff",
        },
        "Long": {
            "bottom": "#93ff93",
            "topStart": "#00a600",
            "topEnd": "#7afec6",
            "mid": "#c1ffe4",
            "side": "#01b468",
        },
        "Special": {
            "bottom": "#ffffaa",
            "topStart": "#ffd306",
            "topEnd": "#f9f900",
            "mid": "#ffed97",
            "side": "#cfad17",
        }
    },
    read: function(speed, song, difficult) {
        const file = `musicalScore/${song}/${difficult}.ms`;
    
        let text = "";

        const xhr = new XMLHttpRequest();
        xhr.open("GET", file, false);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                text = xhr.responseText;
            }
        };

        xhr.send();

        text = text.split("\r\n").filter(x => x.length);
        console.log(text);

        const start = text.indexOf("[start]") + 1,
                end = text.indexOf("[end]");

        return Array.from(
            {length: end - start},
            (x, index) => {
                const info = text[start + index].split(",");
                return {
                    ticks: {
                        start: parseFloat(info[0]) * 30, 
                        end: parseFloat(info[1])
                    },
                    key: {
                        start: parseFloat(info[2]), 
                        length: parseFloat(info[3])
                    },
                    type: info[4],
                    special: parseFloat(info[5])
                }
            }
        );
    }
}