/*** CORE IDEA to create SOUND WAVE
     Input an audio file, scan it to get frequency data
     Create a set of bar using loop
     With the 2nd same loop, assign each bar's height based on each value on frequency data array
*/

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
    const file = musicUpload.files;     // file from computer
    const url = URL.createObjectURL(file[0]);  // file source
    audio.setAttribute('src', url);
    songName.innerText = musicUpload.files[0].name;

    //create audio context
    const audioCtx = new AudioContext();

    //create audio source
    audioSource = audioCtx.createMediaElementSource(audio);

    //create audio analyser
    analyser = audioCtx.createAnalyser();

    //connect audio source to analyser, then connect audio destination
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);  // audio output device (computer speaker)

    bufferLength = analyser.frequencyBinCount;  // 1024 (half of analyser)
    dataArray = new Uint8Array(bufferLength);
})

// create wave bars both up and down side
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
            const frequencyData = dataArray[i]
            const barUp = document.querySelector('#bar-up' + i)
            const barDown = document.querySelector('#bar-down' + i)
            if (!barUp || !barDown) {
                continue;
            }
            const barHeight = Math.max(5, frequencyData / 5);
            barUp.style.height = barHeight + 'px';
            barDown.style.height = barHeight + 'px';
        }

        window.requestAnimationFrame(animation)  // similar to setInterval, but produces higher quality animation without frame skips
    }
    animation()
}
        
    
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