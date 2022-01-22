/*** CORE IDEA to create SOUND WAVE
     Input an audio file, scan it to get frequency data
     Create a set of bar using loop
     With the 2nd same loop, assign each bar's height based on each value on frequency data array
*/

const photoAPI = 'https://api.unsplash.com/photos/random?query=landscape?orientation=landscape&client_id=tCo0LHFg9sl7oaFaVT2PP-cJOoixbGldlLVrvca7zlA';
const waveUp = document.querySelector('.wave-up')
const waveDown = document.querySelector('.wave-down')
const playIcon = document.querySelector('#play-icon');
const pauseIcon = document.querySelector('#pause-icon');
const songName = document.querySelector('.song-name');
const backgroundButton = document.querySelector('.random-background_button')
const musicUpload = document.querySelector('#music-file');
const audio = document.querySelector('#audio');
const creator = document.querySelector('#creator')

const getPhoto = async () => {
    const response = await fetch(photoAPI)
    const photo = await response.json()
    updatePhoto(photo)
}

const updatePhoto = (photo) => {
    const photoLink = photo.urls.regular;
    const creatorName = photo.user.name;
    const creatorLink = photo.user.links.html + '?utm_source=Soundwave_Music_Player&utm_medium=referral';
    creator.innerText = creatorName;    
    creator.setAttribute('href', creatorLink);
    document.documentElement.style.setProperty('--background', `url('${photoLink}')`)
}

backgroundButton.addEventListener('click', () => {
    getPhoto()
})

let audioSource;
let analyser;
let bufferLength;
let dataArray;

musicUpload.addEventListener('change', () => {
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
    

const playMusic = () => {
    
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
        
    
playIcon.addEventListener('click', () => {
    if (musicUpload.files[0]) {
        audio.play();
        playIcon.classList.add('hide')
        pauseIcon.classList.remove('hide')
        playMusic()
    } else {
        alert('Please choose a MP3 file from your computer')
    }
})

pauseIcon.addEventListener('click', () => {
    audio.pause()
    playIcon.classList.remove('hide')
    pauseIcon.classList.add('hide')
})
