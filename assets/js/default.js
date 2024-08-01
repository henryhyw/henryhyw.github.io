document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '' || window.location.hash === '#') { // Check if the current page is not the homepage
        document.querySelectorAll('header *').forEach(element => {
            element.style.color = 'transparent';
        });
        document.querySelectorAll('footer *').forEach(element => {
            element.style.color = 'transparent';
        });
    }
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    document.querySelectorAll('div.scroll-container img').forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
        });
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});
document.addEventListener("DOMContentLoaded", function() {
  const musicIcon = document.getElementById("music-icon");
  const music = document.getElementById("background-music");

  const songs = [
    '/assets/aud/uletali_pticami_gordymi.mp3',
    '/assets/aud/the_portrait.mp3',
    '/assets/aud/asphyxia.mp3',
    '/assets/aud/a_life_so_changed.mp3'
    // Add more song paths here if needed
  ];

  function getRandomSong() {
    return songs[Math.floor(Math.random() * songs.length)];
  }

  function playSong(song) {
    music.src = song;
    music.play().catch(error => {
      console.log("Autoplay prevented. Waiting for user interaction.");
      // Update play status to false and stop spinning
      localStorage.setItem("musicPlaying", "false");
      musicIcon.querySelector("i").classList.remove("fa-spin");
      musicIcon.title = "Play Music";
    });
    musicIcon.querySelector("i").classList.add("fa-spin");
    musicIcon.title = "Pause Music";
  }

  function playRandomSong() {
    const randomSong = getRandomSong();
    localStorage.setItem("currentSong", randomSong);
    playSong(randomSong);
  }

  // Restore music state from localStorage
  const savedSong = localStorage.getItem("currentSong");
  const savedTime = localStorage.getItem("musicTime");
  const musicPlaying = localStorage.getItem("musicPlaying") === "true";

  if (savedSong) {
    console.log(`Restoring song: ${savedSong}`);
    music.src = savedSong;
    if (savedTime) {
      music.currentTime = savedTime;
      console.log(`Restoring time: ${savedTime}`);
    }
    if (musicPlaying) {
      music.play().catch(error => {
        console.log("Autoplay prevented. Waiting for user interaction.");
        // Update play status to false and stop spinning
        localStorage.setItem("musicPlaying", "false");
        musicIcon.querySelector("i").classList.remove("fa-spin");
        musicIcon.title = "Play Music";
      });
      musicIcon.querySelector("i").classList.add("fa-spin");
      musicIcon.title = "Pause Music";
    } else {
      musicIcon.title = "Play Music";
    }
  } else {
    musicIcon.title = "Play Music";
  }

  musicIcon.addEventListener("click", function() {
    if (music.paused) {
      if (!music.src) {
        playRandomSong();
      } else {
        music.play().catch(error => {
          console.log("Autoplay prevented. Waiting for user interaction.");
          // Update play status to false and stop spinning
          localStorage.setItem("musicPlaying", "false");
          musicIcon.querySelector("i").classList.remove("fa-spin");
          musicIcon.title = "Play Music";
        });
        musicIcon.querySelector("i").classList.add("fa-spin");
        musicIcon.title = "Pause Music";
      }
      localStorage.setItem("musicPlaying", "true");
    } else {
      music.pause();
      musicIcon.querySelector("i").classList.remove("fa-spin");
      musicIcon.title = "Play Music";
      localStorage.setItem("musicPlaying", "false");
    }
  });

  // Save music state before leaving the page
  window.addEventListener("beforeunload", function() {
    localStorage.setItem("musicTime", music.currentTime);
    localStorage.setItem("musicPlaying", !music.paused);
    if (music.src) {
      localStorage.setItem("currentSong", music.src);
    }
  });

  // Play next random song when the current one ends
  music.addEventListener("ended", function() {
    playRandomSong();
  });

  // Automatically continue playback if it was playing before
  if (musicPlaying && savedSong) {
    music.play().catch(error => {
      // Update play status to false and stop spinning
      localStorage.setItem("musicPlaying", "false");
      musicIcon.querySelector("i").classList.remove("fa-spin");
      musicIcon.title = "Play Music";
    });
  }
});

if (window.location.pathname !== '/') { // Check if the current page is not the homepage
  document.querySelectorAll('header *').forEach(element => {
      element.style.color = ''; // Reset to original color
  });
  setTimeout(() => {
      document.querySelectorAll('footer *').forEach(element => {
          element.style.color = '';
      });
  }, 1000);
}