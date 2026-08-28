document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const boundImages = new WeakSet();
    let previousFocus = null;

    const openModal = (img) => {
        previousFocus = document.activeElement;
        modalImg.src = img.dataset.fullSrc || img.src;
        modalImg.alt = img.alt || '';
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modal.focus({ preventScroll: true });
    };

    const closeModal = () => {
        if (modal.style.display !== 'flex') return;
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (previousFocus && typeof previousFocus.focus === 'function') {
            previousFocus.focus({ preventScroll: true });
        }
        previousFocus = null;
    };
    
    const applyListeners = () => {
        document.querySelectorAll('div.scroll-container img, img[data-full-src]').forEach(img => {
            if (boundImages.has(img)) return;
            boundImages.add(img);
            img.addEventListener('click', () => {
                openModal(img);
            });
        });
    };
    
    // Initial application of listeners
    applyListeners();
    
    // Observer to detect new elements in the whole document
    const observer = new MutationObserver(applyListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });
});
document.addEventListener("DOMContentLoaded", function() {
  const musicIcon = document.getElementById("music-icon");
  const music = document.getElementById("background-music");

  const songs = [
    '/assets/aud/theme.mp3',
    '/assets/aud/the_portrait.mp3'
  ];

  // Cross-tab coordination: the site's music state lives in localStorage and
  // every tab mirrors it, but only one tab actually plays at a time. When the
  // playing tab closes, it leaves a handoff so one remaining tab can take over;
  // only when every tab is gone does the music stop.
  const MUSIC_CHANNEL = 'henry-site-music';
  const HANDOFF_KEY = 'musicHandoff';
  const CLAIM_KEY = 'musicHandoffClaim';
  const MUSIC_LOCK_NAME = 'henry-site-music-handoff';
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(MUSIC_CHANNEL) : null;
  const LEADER_FRESH_MS = 8000;
  const HANDOFF_FRESH_MS = 60000;

  let currentSongPath = '';
  let tickTimer = null;
  let lastTickSent = 0;
  const seenHandoffTokens = new Set();

  function getRandomSong() {
    return songs[Math.floor(Math.random() * songs.length)];
  }

  function setIcon(playing) {
    if (!musicIcon) return;
    const icon = musicIcon.querySelector('i');
    if (playing) {
      icon.classList.add("fa-spin");
      musicIcon.title = "Pause Music";
      musicIcon.setAttribute("aria-label", "Pause music");
    } else {
      icon.classList.remove("fa-spin");
      musicIcon.title = "Play Music";
      musicIcon.setAttribute("aria-label", "Play music");
    }
  }

  function persistState(playing) {
    localStorage.setItem("musicPlaying", playing ? "true" : "false");
    if (playing) {
      localStorage.setItem("musicLeader", String(Date.now()));
    }
    if (music.src) {
      localStorage.setItem("currentSong", currentSongPath || music.src);
    }
    if (music.currentTime) {
      localStorage.setItem("musicTime", String(music.currentTime));
    }
  }

  function broadcast(message) {
    if (!channel) return;
    try {
      channel.postMessage(message);
    } catch (error) {
      // BroadcastChannel can throw in private-mode edge cases; ignore it.
    }
  }

  function normalizeSongPath(saved) {
    if (!saved) return "";
    if (songs.includes(saved)) return saved;
    const base = window.location.href;
    for (const song of songs) {
      try {
        if (new URL(song, base).href === new URL(saved, base).href) return song;
      } catch (error) {
        // Ignore malformed saved values.
      }
    }
    return "";
  }

  function adoptState(song, time) {
    if (song && currentSongPath !== song) {
      currentSongPath = song;
      music.src = song;
    }
    if (typeof time === "number" && isFinite(time)) {
      try {
        music.currentTime = time;
      } catch (error) {
        // The media element may not be ready to seek yet; the position is
        // carried in the shared state and applied on the next sync.
      }
    }
  }

  function startTicking() {
    if (tickTimer) return;
    tickTimer = setInterval(() => {
      localStorage.setItem("musicTime", String(music.currentTime));
      localStorage.setItem("musicLeader", String(Date.now()));
      const now = Date.now();
      if (now - lastTickSent >= 5000) {
        lastTickSent = now;
        broadcast({ type: "tick", song: currentSongPath, time: music.currentTime });
      }
    }, 1000);
  }

  function stopTicking() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  function startPlayback(song, time) {
    // Starting audio consumes any pending handoff: this tab is now the leader.
    clearHandoff();
    if (song) {
      currentSongPath = song;
      music.src = song;
    }
    if (typeof time === "number" && isFinite(time)) {
      try {
        music.currentTime = time;
      } catch (error) {
        // The media element may not be ready to seek yet; the position is
        // carried in the shared state and applied on the next sync.
      }
    }
    // Claim the leader slot before play() resolves so a concurrent successor
    // backs off instead of starting a second copy of the audio.
    persistState(true);
    return music.play().then(() => {
      setIcon(true);
      lastTickSent = Date.now();
      broadcast({ type: "play", song: currentSongPath, time: music.currentTime });
      startTicking();
    }).catch(error => {
      console.log("Autoplay prevented. Waiting for user interaction.");
      setIcon(false);
      persistState(false);
    });
  }

  function playRandomSong() {
    startPlayback(getRandomSong());
  }

  function pauseMusic() {
    music.pause();
    setIcon(false);
    persistState(false);
    broadcast({ type: "pause" });
    stopTicking();
    clearHandoff();
  }

  // Narration has the visitor's attention. Pause the shared music session so
  // the summary and background music never compete for the same listener.
  window.addEventListener('view-summary-play', pauseMusic);

  // Another tab started, paused, or advanced playback. Mirror the shared
  // state here without duplicating the audio. The icon always reflects the
  // global playback state, and the local element follows the leader's
  // position so any tab can take over seamlessly.
  function handleRemote(message) {
    if (!message || typeof message !== "object") return;
    if (message.type === "play") {
      if (!music.paused) music.pause();
      stopTicking();
      adoptState(message.song, message.time);
      setIcon(true);
    } else if (message.type === "pause") {
      if (!music.paused) music.pause();
      stopTicking();
      setIcon(false);
    } else if (message.type === "tick") {
      if (music.paused) {
        adoptState(message.song, message.time);
      }
    } else if (message.type === "takeover") {
      tryTakeoverPlayback();
    }
  }

  if (channel) {
    channel.onmessage = (event) => handleRemote(event.data);
  }

  // Fallback coordination: the storage event fires in other tabs whenever the
  // leading tab writes playback state.
  function syncFromStorage() {
    const playing = localStorage.getItem("musicPlaying") === "true";
    const leader = parseInt(localStorage.getItem("musicLeader"), 10) || 0;
    if (playing && Date.now() - leader < LEADER_FRESH_MS) {
      setIcon(true);
      adoptState(
        normalizeSongPath(localStorage.getItem("currentSong")),
        parseFloat(localStorage.getItem("musicTime"))
      );
    } else {
      handleRemote({ type: "pause" });
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function readHandoff() {
    try {
      const raw = localStorage.getItem(HANDOFF_KEY);
      if (!raw) return null;
      const handoff = JSON.parse(raw);
      if (!handoff || !handoff.token || !handoff.song) return null;
      return handoff;
    } catch (error) {
      return null;
    }
  }

  function freshHandoff() {
    const handoff = readHandoff();
    if (!handoff) return null;
    if (Date.now() - Number(handoff.ts || 0) > HANDOFF_FRESH_MS) return null;
    return handoff;
  }

  function clearHandoff() {
    try {
      localStorage.removeItem(HANDOFF_KEY);
    } catch (error) {
      // Ignore storage failures; a stale handoff expires on its own.
    }
  }

  function persistHandoff(song, time, attempts = 0) {
    const handoff = {
      token: Math.random().toString(36).slice(2) + String(Date.now()),
      song: song || currentSongPath || music.src || '',
      time: typeof time === "number" ? time : music.currentTime || 0,
      ts: Date.now(),
      attempts,
    };
    try {
      localStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
    } catch (error) {
      // Ignore storage failures; the BroadcastChannel message still goes out.
    }
    return handoff;
  }

  // The winning tab clears the handoff when it claims the audio, then starts
  // playback at the saved position. If the browser blocks autoplay there, it
  // writes a fresh handoff and asks the remaining tabs to try once more.
  function startTakeoverPlayback(handoff) {
    startPlayback(handoff.song, handoff.time).catch(() => {
      if ((handoff.attempts || 0) >= 1) return;
      const retry = persistHandoff(handoff.song, handoff.time, (handoff.attempts || 0) + 1);
      broadcast({ type: "takeover", song: retry.song, time: retry.time });
    });
  }

  function claimIsOurs(token) {
    try {
      const raw = localStorage.getItem(CLAIM_KEY);
      if (!raw) return false;
      const claim = JSON.parse(raw);
      return Boolean(claim && claim.token === token);
    } catch (error) {
      return false;
    }
  }

  // Browsers without the Web Locks API elect a successor by writing a claim
  // token; the last writer wins, and a second check keeps a very late tab from
  // bumping an already-playing successor.
  async function claimTakeover() {
    const token = Math.random().toString(36).slice(2) + String(Date.now());
    try {
      localStorage.setItem(CLAIM_KEY, JSON.stringify({ token, ts: Date.now() }));
    } catch (error) {
      return;
    }
    await sleep(350);
    if (!claimIsOurs(token)) return;
    await sleep(300);
    if (!claimIsOurs(token)) return;
    const handoff = freshHandoff();
    if (handoff) startTakeoverPlayback(handoff);
  }

  async function tryTakeoverPlayback() {
    const handoff = freshHandoff();
    if (!handoff || seenHandoffTokens.has(handoff.token)) return;
    seenHandoffTokens.add(handoff.token);
    if ("locks" in navigator) {
      try {
        await navigator.locks.request(MUSIC_LOCK_NAME, () => {
          const current = freshHandoff();
          if (current) startTakeoverPlayback(current);
        });
      } catch (error) {
        claimTakeover();
      }
    } else {
      claimTakeover();
    }
  }

  window.addEventListener("storage", (event) => {
    if (!event.key) return;
    if (/^(musicPlaying|musicLeader|musicTime|currentSong)$/.test(event.key)) {
      syncFromStorage();
      return;
    }
    if (event.key === HANDOFF_KEY) {
      tryTakeoverPlayback();
    }
  });

  // Restore music state from localStorage
  const savedSong = normalizeSongPath(localStorage.getItem("currentSong"));
  const savedTime = parseFloat(localStorage.getItem("musicTime"));
  const musicPlaying = localStorage.getItem("musicPlaying") === "true";
  const leaderTime = parseInt(localStorage.getItem("musicLeader"), 10) || 0;
  const anotherTabPlaying = musicPlaying && (Date.now() - leaderTime < LEADER_FRESH_MS);

  if (savedSong) {
    console.log(`Restoring song: ${savedSong}`);
    adoptState(savedSong, savedTime);
  }

  // The icon reflects the shared playback state, not this tab's own audio.
  setIcon(musicPlaying && anotherTabPlaying);

  musicIcon.addEventListener("click", function() {
    // Global toggle: the button controls the shared player, so clicking it in
    // any window pauses or starts the same playback.
    const globalPlaying = localStorage.getItem("musicPlaying") === "true";
    if (!globalPlaying) {
      if (!currentSongPath && !music.src) {
        playRandomSong();
      } else {
        startPlayback();
      }
    } else {
      pauseMusic();
    }
  });

  // Save music state before leaving the page
  window.addEventListener("beforeunload", function() {
    // If this tab is the leader, persist the running playback. If it is only
    // mirroring another tab's playback, leave the shared state untouched so
    // the actual leader keeps playing.
    if (!music.paused) {
      persistState(true);
    }
  });

  // When the playing tab closes, hand the audio to one remaining tab. The
  // handoff is written synchronously so the storage event reaches every other
  // open tab even if the BroadcastChannel message is not delivered during
  // unload. Mirror tabs (music.paused is true) leave the leader alone.
  window.addEventListener("pagehide", function() {
    if (music.paused) return;
    persistState(true);
    const handoff = persistHandoff();
    broadcast({ type: "takeover", song: handoff.song, time: handoff.time });
  });

  // A bfcache-restored tab may have missed messages while it was frozen, so
  // re-sync its icon and pick up a pending handoff if one is still fresh.
  window.addEventListener("pageshow", function() {
    syncFromStorage();
    if (freshHandoff()) {
      window.setTimeout(() => tryTakeoverPlayback(), 300);
    }
  });

  // Play next random song when the current one ends
  music.addEventListener("ended", function() {
    playRandomSong();
  });

  // Automatically continue playback after a reload only when no other tab is
  // actively playing, so two windows never play at the same time.
  if (musicPlaying && savedSong && !anotherTabPlaying) {
    startPlayback(savedSong);
  }

  // A tab that reloads after playing, or a tab opened right after the last one
  // closed, inherits the saved audio through the handoff.
  if (freshHandoff()) {
    window.setTimeout(() => tryTakeoverPlayback(), 300);
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
