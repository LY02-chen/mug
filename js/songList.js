const songList = [
    {
        title: "Tempestissimo",
        difficult: [1, 2, 3, 4, 34, 1]
    },
    {
        title: "Don't Fight The Music",
        difficult: [0, 0, 0, 0, 36, 0]
    },
    {
        title: "the EmpErroR",
        difficult: [0, 0, 0, 0, 36, 0]
    },
    {
        title: "エンドマークに希望と涙を添えて",
        difficult: [0, 0, 0, 0, 35, 0]
    },
    {
        title: "マシンガンポエムドール",
        difficult: [0, 0, 0, 0, 34, 0]
    }
];

const path = (index) => {
    return `song_list/${songList[index].title}/`;
}

const songImage = Array.from({length: songList.length}, (x, index) => {
    const src = `${path(index)}image.jpg`;
    const image = new Image();
    image.src = src;
    return image;
});

const songAudioFull = Array.from({length: songList.length}, (x, index) => {
    const src = `${path(index)}audio-full.mp3`;
});

const songAudioPreview = Array.from({length: songList.length}, (x, index) => {
    const src = `${path(index)}audio-preview.mp3`;
});

const songSelectCanvas = Array.from({length: songList.length}, (x, index) => {
    return Array.from({length: 6}, (x, difficult) => {
        const canvas = document.createElement("canvas"),
              ctx = canvas.getContext("2d");

        canvas.width = selectWidth * 20;
        canvas.height = selectHeight * 20;
    
        ctx.fillStyle = "#39293d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function circle(color, radius) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(canvas.width * 0.1, canvas.height / 2, canvas.height * radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        circle("white", 0.4);
        circle(difficultColor[difficult], 0.32);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";

        ctx.font = "bold 500pt Arial";
        ctx.fillText(`${songList[index].difficult[difficult]}`, canvas.width * 0.1, canvas.height / 2);

        
        ctx.fillText(`${songList[index].title}`, canvas.width / 2, canvas.height / 2);

        return canvas;
    })
});