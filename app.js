const musicUpload = document.querySelector('#music-file');
const audio = document.querySelector('#audio');
const playIcon = document.querySelector('.icon');
const songName = document.querySelector('.song-name');
const audioCtx = new AudioContext();
const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;


musicUpload.addEventListener('change', function(e) {
    const file = musicUpload.files;
    const url = URL.createObjectURL(file[0]);
    audio.setAttribute('src', url);
    songName.innerText = musicUpload.files[0].name;
})

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

function playMusic () {
    audioSource = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);  // audio output device (computer speaker)
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate () {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }
    animate();

}