const Note = {
    // new Note.Note(
    //     group = notes, 
    //     noteInfo: {
    //         key: {start: int, length: int},
    //         type: "Note" / "Up" / "Down" / "Long",
    //         ticks: {start: float, end: float},
    //         special: true/ false,
    //         front: true/ false
    //     }
    // )
    Note: function(group, noteInfo) {
        const key = noteInfo.key,
              type = noteInfo.type,
              ticks = noteInfo.ticks,
              special = noteInfo.special,
              front = noteInfo.front;

        const ticksToY = (time) => {
            return time * speed / 10;
        }

        const initX = noteWidth * (key.start + key.length / 2),
              Y = {
                start: ticksToY(ticks.start),
                end: ticksToY(ticks.end) - (front ? noteHeight : 0)
              };

        const noteGeometry = Note.drawNote(key.length, type, special, Y);

        noteGeometry.position.set(initX, Y.start, 0);
        group.add(noteGeometry);

        this.down = (time) => {
            if (noteGeometry.position.y + (Y.end - Y.start) > -100)
                noteGeometry.position.y = ticksToY(ticks.start - time);
        }
    },
    drawNote: function(length, type, special, Y) {
        const width = noteWidth * length,
              height = noteHeight,
              radius = noteRadius;

        const geometryArray = [],
              materialArray = [];

        function addGeometry(geomatry, material) {
            geometryArray.push(geomatry);
            materialArray.push(material);
        }

        addGeometry(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: new THREE.CanvasTexture(
                    Note.noteMaterial(type, special, width, height, radius)
                ),
                transparent: true
            })
        );
        
        if (type == "Long") {
            const planeEnd = new THREE.PlaneGeometry(width, height);
            planeEnd.translate(0, Y.end - Y.start, 0);
            addGeometry(
                planeEnd,
                new THREE.MeshBasicMaterial({
                    map: new THREE.CanvasTexture(
                        Note.noteMaterial(type, special, width, height, radius)
                    ),
                    transparent: true
                })
            );

            const planeLong = new THREE.PlaneGeometry(width, Y.end - Y.start - height);
            planeLong.translate(0, (Y.end - Y.start) / 2, 0);
            addGeometry(
                planeLong,
                new THREE.MeshBasicMaterial({
                    map: new THREE.CanvasTexture(
                        Note.longMaterial(special, width, Y.end - Y.start - height)
                    )
                })
            );
        }
        else if (type == "Up" || type == "Down") {
            const planeSlide = new THREE.PlaneGeometry(width / 2, height);
            planeSlide.rotateX(Math.PI * 0.5);
            planeSlide.translate(0, 0, height * 2);
            addGeometry(
                planeSlide,
                new THREE.MeshBasicMaterial({
                    map: new THREE.CanvasTexture(
                        Note.slideMaterial(type, special, width / 2, height, radius)
                    ),
                    transparent: true
                })
            );
        }
                
        return new THREE.Mesh(
            THREE.BufferGeometryUtils.mergeBufferGeometries(
                geometryArray, true
            ), 
            materialArray
        );
    },
    noteMaterial: function(type, special, width, height, radius) {
        const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");

        const offset = noteOffset;

        const scale = canvasScale;
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
            radius, 
            "bottom", 
            0, height * offset
        );
        drawRect(
            width, height * (1 - offset), 
            radius, 
            "top", 
            0, 0
        );
        drawRect(
            width - height * (offset * 2), height * (1 - offset * 3), 
            radius * (1 - offset * 3), 
            "mid", 
            height * offset, height * offset
        );
        drawSide(
            height / 5, radius / 5,
            height * offset, height * (0.8 - offset) / 2
        );

        return canvas;
    },
    longMaterial: function(special, width, height) {
        const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");

        const offset = noteOffset;

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = (special ? 
            Note.color["Special"] : 
            Note.color["Long"])["longFrame"];
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = (special ? 
            Note.color["Special"] : 
            Note.color["Long"])["longSolid"];
        ctx.fillRect(width * offset, 0, width * (1 - offset * 2), height);

        return canvas;
    },
    slideMaterial: function(type, special, width, height, radius) {
        const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");

        const offset = noteOffset;

        const scale = canvasScale;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);

        if (type == "Up") {
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
        }

        const color = special ? Note.color["Special"] : Note.color[type];

        const degree = Math.atan((height * 0.4) / (width / 2));

        function drawArrow(width, height, radius, part, dx, dy) {
            ctx.fillStyle = color[part];

            ctx.translate(dx, dy);
            ctx.beginPath();

            ctx.moveTo(0, 0);
            ctx.lineTo(width / 2, (width / 2) * Math.tan(degree));
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height - (width / 2) * Math.tan(degree));
            ctx.lineTo(width / 2, height);
            ctx.lineTo(0, height - (width / 2) * Math.tan(degree));

            ctx.closePath();
            ctx.fill();
            ctx.translate(-dx, -dy);
        }

        drawArrow(
            width, height,
            radius, 
            "slideFrame",
            0, 0
        );
        drawArrow(
            width - height * offset, height * (1 - offset / 2 * (Math.tan(Math.PI / 4 + degree / 2) + Math.sqrt(2))),
            radius * (1 - offset), 
            "slideSolid",
            height * offset / 2, (height * offset / 2) * Math.tan(Math.PI / 4 + degree / 2)
        );

        return canvas;
    },
    color: {
        "Note": {
            "bottom": "#80ffff",
            "topStart": "#ca8eff",
            "topEnd": "#acd6ff",
            "mid": "#c4e1ff",
            "side": "#7d7dff"
        },
        "Up": {
            "bottom": "#ffb6c1",
            "topStart": "#de6890",
            "topEnd": "#eca7be",
            "mid": "#ffd9ec",
            "side": "#d56767",
            "slideFrame": "#de6890",
            "slideSolid": "#eca7be"
        },
        "Down": {
            "bottom": "#acd6ff",
            "topStart": "#0066cc",
            "topEnd": "#66b3ff",
            "mid": "#66b3ff",
            "side": "#2e2eff",
            "slideFrame": "#0066cc",
            "slideSolid": "#66b3ff"
        },
        "Long": {
            "bottom": "#93ff93",
            "topStart": "#00a600",
            "topEnd": "#7afec6",
            "mid": "#c1ffe4",
            "side": "#01b468",
            "longFrame": "#7df2b4",
            "longSolid": "#a8fad7"
        },
        "Special": {
            "bottom": "#ffffaa",
            "topStart": "#ffd306",
            "topEnd": "#f9f900",
            "mid": "#ffed97",
            "side": "#cfad17",
            "slideFrame": "#ffd306",
            "slideSolid": "#f9f900",
            "longFrame": "#ffe561",
            "longSolid": "#fff3b8"
        }
    },
    read: function(file) {
        let text = "";

        const xhr = new XMLHttpRequest();
        xhr.open("GET", file, false);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                text = xhr.responseText
                       .split(/\r?\n/)
                       .filter(x => x.length)
                       .map(x => x.split(" "));
            }
        };

        xhr.send();

        const start = text.findIndex(x => x[0] == "[Start]") + 1,
              end = text.findIndex(x => x[0] == "[End]");
              
        let BPM = 0,
            Beat = 0;

        const notes = [];

        for (let i = start; i < end ; i++){
            const tmp = text[i];

            if (tmp[0] == "[BPM]") {
                BPM = parseInt(tmp[1]);
                continue;
            } 
            if (tmp[0] == "[Beat]") {
                Beat += parseFloat(tmp[1]);
                continue;
            } 
            
            const beatToTicks = (beat) => {
                return (beat + Beat) * 60 * 1000 / BPM + 5500;
            }

            notes.push({
                key: {
                    start: tmp[2].indexOf("1"),
                    length: tmp[2].replace(/0/g, "").length
                },
                type: tmp[0] == "[Note]" ? "Note" :
                      tmp[0] == "[Up__]" ? "Up" :
                      tmp[0] == "[Down]" ? "Down" : "Long",
                ticks: {
                    start: beatToTicks(parseFloat(tmp[3])),
                    end: tmp[0] == "[Long]" ? 
                         beatToTicks(parseFloat(tmp[4])) : 
                         beatToTicks(parseFloat(tmp[3]))
                },
                special: tmp[1] == "[True_]" ? true : false,
                front: tmp[0] == "[Long]" && tmp[5] == "Front" ? true : false
            });
        }

        return notes;
    }
}