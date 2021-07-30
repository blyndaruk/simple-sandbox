import WaveSurfer from 'wavesurfer.js';

import '../scss/audio.scss';

document.addEventListener('DOMContentLoaded', () => {
  const $players = [...document.querySelectorAll('.js-custom-player')]

  if (!$players.length) return;

  $players.forEach((player) => {
    const $waveContainer = player.querySelector('.js-wave-container');
    const source = player.querySelector('.js-audio-source').src;
    const $playBtn = player.querySelector('.js-play-btn');
    const $prevBtn = player.querySelector('.js-prev-btn');
    const $nextBtn = player.querySelector('.js-next-btn');
    const $speedBtns = player.querySelectorAll('.js-speed');

    const wavesurfer = WaveSurfer.create({
      container: $waveContainer,
      waveColor: 'grey',
      progressColor: '#f36314',
      cursorColor: '#fff',
      barWidth: 3,
      backgroundColor: '#f8f8f8',
      barRadius: 4,
      cursorWidth: 3,
      height: 100,
      responsive: true,
      skipLength: 15,
    });


    wavesurfer.load(source);
    wavesurfer.on('ready', () => {
      player.classList.add('is-ready');

      $playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!$playBtn.classList.contains('is-active')) {
          [...document.querySelectorAll('.js-play-btn')].forEach(btn => {
            if (btn.classList.contains('is-active')) {
              btn.click()
            }
          });
        }
        $playBtn.classList.toggle('is-active');
        wavesurfer.playPause();
      });

      $prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        wavesurfer.skipBackward();
      });

      $nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        wavesurfer.skipForward();
      });

      $speedBtns.forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          if (wavesurfer.getPlaybackRate() === 1) {
            wavesurfer.setPlaybackRate(el.dataset.speed);
          } else {
            wavesurfer.setPlaybackRate(1)
          }
        });
      });
    });
  });
});
