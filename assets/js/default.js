document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '' || window.location.hash === '#' || window.location.hash === '#/') { // Check if the current page is not the homepage
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
    
    const applyListeners = () => {
        document.querySelectorAll('div.scroll-container img').forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = img.src;
            });
        });
    };
    
    // Initial application of listeners
    applyListeners();
    
    // Observer to detect new elements in the whole document
    const observer = new MutationObserver(applyListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
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

// Rotating sample prompts for the Ask palette.
document.addEventListener("DOMContentLoaded", function() {
  const originalPlaceholder = "Ask anything about Henry, then press Enter.";
  const samples = [
    "What is Henry's research about?",
    "Which papers has Henry written?",
    "How does Henry connect cognitive science and AI?",
    "What projects has Henry built?",
    "Where has Henry studied?",
    "What did Henry do at PwC and HSBC?",
    "What is Henry's work on mechanistic interpretability?"
  ];

  let current = 0;
  let rotating = false;

  function injectStyles() {
    if (document.getElementById("henry-ask-sample-style")) return;

    const style = document.createElement("style");
    style.id = "henry-ask-sample-style";
    style.textContent = `
      .henry-ask-samples {
        display: block;
        text-align: left;
      }

      .henry-ask-label,
      .henry-ask-hint {
        display: none;
      }

      .henry-ask-sample {
        appearance: none;
        border: 0;
        border-radius: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        font: inherit;
        line-height: inherit;
        padding: 0;
        max-width: none;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 260ms ease, transform 260ms ease, color 160ms ease;
      }

      .henry-ask-sample.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .henry-ask-sample.is-fading {
        opacity: 0;
        transform: translateY(-4px);
      }

      .henry-ask-sample:hover,
      .henry-ask-sample:focus-visible {
        color: #222;
        outline: none;
      }

      body.dark-mode .henry-ask-sample:hover,
      body.dark-mode .henry-ask-sample:focus-visible {
        color: #fff;
      }

      @media (prefers-reduced-motion: reduce) {
        .henry-ask-sample {
          opacity: 1;
          transform: none;
          transition: color 160ms ease;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getPanel() {
    return document.querySelector(".sp-panel");
  }

  function isAskMode(panel) {
    const activeMode = panel && panel.querySelector(".sp-mode.active");
    return !!(activeMode && activeMode.textContent.toLowerCase().includes("ask"));
  }

  function getInput(panel) {
    return panel && panel.querySelector(".sp-input");
  }

  function getEmptyTarget(panel) {
    if (!panel) return null;

    const existing = panel.querySelector('.sp-ask .sp-empty[data-henry-ask-samples="true"]');
    if (existing) return existing;

    return Array.from(panel.querySelectorAll(".sp-ask .sp-empty")).find(element => {
      return element.textContent.includes("Ask anything about Henry");
    }) || null;
  }

  function fixPlaceholder(input) {
    if (input && input.getAttribute("placeholder") !== originalPlaceholder) {
      input.setAttribute("placeholder", originalPlaceholder);
    }
  }

  function fillSample(text) {
    const panel = getPanel();
    const input = getInput(panel);
    if (!input) return;

    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus();
  }

  function ensureSampleButton(target) {
    if (!target.dataset.henryAskSamples) {
      target.dataset.henryAskSamples = "true";
      target.innerHTML = `
        <div class="henry-ask-samples" aria-live="polite">
          <span class="henry-ask-label">Try asking</span>
          <button class="henry-ask-sample" type="button"></button>
          <span class="henry-ask-hint">then press Enter.</span>
        </div>
      `;
    }

    const button = target.querySelector(".henry-ask-sample");
    if (button && !button.dataset.bound) {
      button.dataset.bound = "true";
      button.addEventListener("click", function() {
        fillSample(button.textContent.trim());
      });
    }

    return button;
  }

  function showCurrentSample() {
    const panel = getPanel();
    if (!panel || !isAskMode(panel)) return;

    const input = getInput(panel);
    if (!input) return;
    fixPlaceholder(input);

    const hasQuery = input.value.trim().length > 0;
    const target = getEmptyTarget(panel);
    if (!target || hasQuery) return;

    const button = ensureSampleButton(target);
    if (!button) return;

    const sample = samples[current];
    if (button.dataset.currentSample !== sample) {
      button.classList.remove("is-visible", "is-fading");
      button.textContent = sample;
      button.dataset.currentSample = sample;
      window.requestAnimationFrame(() => {
        button.classList.add("is-visible");
      });
    } else {
      button.classList.add("is-visible");
    }
  }

  function rotateSample() {
    if (rotating) return;

    const panel = getPanel();
    const input = getInput(panel);
    if (!panel || !isAskMode(panel) || !input || input.value.trim()) {
      showCurrentSample();
      return;
    }

    const target = getEmptyTarget(panel);
    const button = target && target.querySelector(".henry-ask-sample");
    if (!button) {
      showCurrentSample();
      return;
    }

    rotating = true;
    button.classList.remove("is-visible");
    button.classList.add("is-fading");

    window.setTimeout(() => {
      current = (current + 1) % samples.length;
      button.classList.remove("is-fading", "is-visible");
      button.textContent = samples[current];
      button.dataset.currentSample = samples[current];
      window.requestAnimationFrame(() => {
        button.classList.add("is-visible");
        rotating = false;
      });
    }, 280);
  }

  injectStyles();
  showCurrentSample();

  window.setInterval(rotateSample, 3200);

  const observer = new MutationObserver(function() {
    showCurrentSample();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener("input", function(event) {
    if (event.target && event.target.matches && event.target.matches(".sp-input")) {
      showCurrentSample();
    }
  }, true);

  document.addEventListener("click", function() {
    window.setTimeout(showCurrentSample, 0);
  }, true);
});
