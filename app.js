const musicUpload = document.querySelector('#music-file');
const audio = document.querySelector('#audio');
const playIcon = document.querySelector('.icon');
const songName = document.querySelector('.song-name')


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
})