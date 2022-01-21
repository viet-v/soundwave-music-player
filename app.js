const waveUp = document.querySelector('.wave-up')
const waveDown = document.querySelector('.wave-down')
const musicUpload = document.querySelector('#music-file');
const audio = document.querySelector('#audio');
const playIcon = document.querySelector('.icon');
const songName = document.querySelector('.song-name');

let audioSource;
let analyser;
let bufferLength;
let dataArray;

musicUpload.addEventListener('change', function() {
    const file = musicUpload.files;
    const url = URL.createObjectURL(file[0]);
    audio.setAttribute('src', url);
    songName.innerText = musicUpload.files[0].name;

    const audioCtx = new AudioContext();
    audioSource = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);  // audio output device (computer speaker)
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
})

for (let i = 0; i < 35; i++) {
    const barUp = document.createElement('div')
    barUp.setAttribute('id', 'bar-up' + i)
    barUp.setAttribute('class', 'wave-bar_up')
    waveUp.append(barUp)

    const barDown = document.createElement('div')
    barDown.setAttribute('id', 'bar-down' + i)
    barDown.setAttribute('class', 'wave-bar_down')
    waveDown.append(barDown)
}
    

function playMusic () {
    
    function animation () {
        analyser.getByteFrequencyData(dataArray)

        for (let i = 0; i < 35; i++) {    
            const index = (i + 10) * 2
            const frequencyData = dataArray[index]
            const barUp = document.querySelector('#bar-up' + i)
            if (!barUp) {
                continue;
            }
            const barHeight = Math.max(4, frequencyData / 2);
            barUp.style.height = barHeight + 'px';

            const barDown = document.querySelector('#bar-down' + i)
            barDown.style.height = barHeight + 'px';
        }

        window.requestAnimationFrame(animation)
    }
    animation()
}
    

    
/*
    function renderFrame() {

        // create audio context
        const audioCtx = new AudioContext();

        // create an audio source
        const audioSource = audioCtx.createMediaElementSource(audio);
        // console.log(audioSource)

        // create an analyser
        const analyser = audioCtx.createAnalyser();

        // connect the source to analyser, then back to the context destination
        audioSource.connect(analyser);
        audioSource.connect(audioCtx.destination);  // audio output device (computer speaker)

        // the analyse frequencies
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < 35; i++) {
            const bar = document.createElement('div')
            bar.setAttribute('id', 'bar' + i)
            bar.setAttribute('class', 'wave-bar')
            waveContainer.append(bar)
        }
 
        for (let i = 0; i < 35; i++) {
            const frequencyData = dataArray[i]

            const bar = document.querySelector('#bar' + i)
            if (!bar) {
                continue;
            }

            const barHeight = Math.max(4, frequencyData || 0);
            bar.style.height = barHeight + 'px';
        }
        window.requestAnimationFrame(renderFrame)
    }

*/    
    
    playIcon.addEventListener('click', function () {
        if (audio.paused) {
            audio.play();
            playIcon.innerHTML = `<i class="fas fa-pause"></i>`;
            
        } else {
            audio.pause();
            playIcon.innerHTML = `<i class="fas fa-play"></i>`;
        }
        playMusic()
    })