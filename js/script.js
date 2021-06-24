const MUSIC_PLAYER = document.querySelector('.music-player');
const COVER = MUSIC_PLAYER.querySelector('.music-player__cover');
const COVER_IMG = COVER.querySelector('img');
const AUDIO_PLAYLIST = MUSIC_PLAYER.querySelector('.audio-playlist');
const AUDIO_PLAYLIST_BUTTON = AUDIO_PLAYLIST.querySelector('.audio-playlist__button');
const AUDIO = MUSIC_PLAYER.querySelector('.music-player__audio');
const AUDIO_NAME = MUSIC_PLAYER.querySelector('.audio-info__name');
const AUDIO_ARTIST = MUSIC_PLAYER.querySelector('.audio-info__artist');
const BACKWARD_BTN = document.getElementById('backward');
const PLAY_BTN = document.getElementById('play');
const FORWARD_BTN = document.getElementById('forward');
const AUDIO_TRACK = MUSIC_PLAYER.querySelector('.audio-progress__track');
const AUDIO_TRACK_DURATION = MUSIC_PLAYER.querySelector('.audio-progress__duration');
const AUDIO_TRACK_PLAYED = AUDIO_TRACK.querySelector('span');
const REQUEST_URL = 'data.json';

let audioIndex = 0;

async function getData(url) {
  const RESPONSE = await fetch(url);
  const AUDIO_DATA = await RESPONSE.json();
  return AUDIO_DATA;
}

getData(REQUEST_URL).then(data => {
  renderData(data);
});

const renderData = data => {
  getAudio(data.audio[audioIndex]);
  PLAY_BTN.addEventListener('click', () => {
    const IS_PLAYING = MUSIC_PLAYER.classList.contains('music-player--play');

    if (IS_PLAYING) {
      pauseAudio();
    }
    else {
      playAudio();
    }
  });

  BACKWARD_BTN.addEventListener('click', () => {
    audioIndex--;
    AUDIO_TRACK_PLAYED.style.width = `0%`;
    const IS_PLAYING = MUSIC_PLAYER.classList.contains('music-player--play');

    if (audioIndex < 0) {
      audioIndex = data.audio.length - 1;
    }

    getAudio(data.audio[audioIndex]);

    if (IS_PLAYING) {
      pauseAudio();
    }
  });

  FORWARD_BTN.addEventListener('click', () => {
    audioIndex++;
    AUDIO_TRACK_PLAYED.style.width = `0%`;
    const IS_PLAYING = MUSIC_PLAYER.classList.contains('music-player--play');

    if (audioIndex >= data.audio.length) {
      audioIndex = 0;
    }

    getAudio(data.audio[audioIndex]);

    if (IS_PLAYING) {
      playAudio();
    }
  });

  AUDIO.addEventListener('ended', () => {
    audioIndex++;
    const IS_PLAYING = MUSIC_PLAYER.classList.contains('music-player--play');

    if (audioIndex >= data.audio.length) {
      audioIndex = 0;
    }

    getAudio(data.audio[audioIndex]);

    if (IS_PLAYING) {
      playAudio();
    }
  });

  AUDIO.addEventListener('timeupdate', (e) => {
    const AUDIO_DURATION = e.target.duration;
    const AUDIO_CURRENT_TIME = e.target.currentTime;
    const AUDIO_PROGRESS = (AUDIO_CURRENT_TIME / AUDIO_DURATION) * 100;
    AUDIO_TRACK_PLAYED.style.width = `${AUDIO_PROGRESS}%`;
    const CONVERTED_DURATION = formatTime(AUDIO_DURATION);
    const CONVERTED_CURRENT_TIME = formatTime(AUDIO_CURRENT_TIME);
    AUDIO_TRACK_DURATION.textContent = `${CONVERTED_CURRENT_TIME}/${CONVERTED_DURATION}`;
  });

  AUDIO_TRACK.addEventListener('click', (e) => {
    const AUDIO_TRACK_WIDTH = e.target.clientWidth;
    const CLICK_X = e.offsetX;
    const AUDIO_DURATION = AUDIO.duration;
    AUDIO.currentTime = (CLICK_X / AUDIO_TRACK_WIDTH) * AUDIO_DURATION;
    const IS_PLAYING = MUSIC_PLAYER.classList.contains('music-player--play');

    if (!IS_PLAYING) {
      playAudio();
    }
  });

  AUDIO_PLAYLIST_BUTTON.addEventListener('click', (e) => {
    AUDIO_PLAYLIST.classList.toggle('audio-playlist--active');
  });
}

function getAudio(data) {
  AUDIO_NAME.textContent = data.audioName;
  AUDIO_ARTIST.textContent = data.audioArtist;
  AUDIO.src = data.audioFile;
  COVER_IMG.src = data.audioCover;
}

function playAudio() {
  MUSIC_PLAYER.classList.add('music-player--play');
  PLAY_BTN.querySelector('i.fas').classList.remove('fa-play');
  PLAY_BTN.querySelector('i.fas').classList.add('fa-pause');
  AUDIO.play();
}

function pauseAudio() {
  MUSIC_PLAYER.classList.remove('music-player--play');
  PLAY_BTN.querySelector('i.fas').classList.add('fa-play');
  PLAY_BTN.querySelector('i.fas').classList.remove('fa-pause');
  AUDIO.pause();
}

function formatTime(time) {
  let minutes = 0|(time / 60);
  let seconds = 0|(time % 60);

  if (minutes < 10) { minutes = '0'+ minutes; }
  if (seconds < 10) { seconds = '0' + seconds; }
  return `${minutes}:${seconds}`;
}