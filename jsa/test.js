function test() {
    const btnDiv = document.createElement("div");
    const btnStop = document.createElement("button");
    btnStop.innerHTML = "Stop";
    btnStop.onclick = () => {
        pause = true;
    }
    const p = document.createElement("p");
    p.innerHTML = "譜面 : ";
    btnDiv.appendChild(btnStop);
    btnDiv.appendChild(p);
    
    const difficult = ["easy", "normal", "hard", "expert", "master", "ultimate"];
    
    const btn = (song, dif, div) => {
        const btn = document.createElement("button");
        btn.onclick = () => {
            pause = false;
            Game.gamePlay(song, difficult[dif])
        };
        btn.innerHTML = difficult[difficult];
        div.appendChild(btn);
    };
    
    for (let i = 1; i < songList.length; i++) {
        const div = document.createElement("div");
        const p = document.createElement("p");
        p.innerHTML = songList[i].title + " : ";
        div.appendChild(p);
        for(let j in difficult)
            if (songList[i].difficult[j])
                btn(i, j, div);            
        btnDiv.appendChild(div);
    }
    
    document.body.appendChild(btnDiv);    
}

test();