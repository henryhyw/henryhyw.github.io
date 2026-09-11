function initSiteMusic() {
  const musicIcon = document.getElementById("music-icon");
  const music = document.getElementById("background-music");
  if (!music || !musicIcon || music.dataset.initialized) return;
  music.dataset.initialized = 'true';

  const tracks = [
    { src: '/assets/aud/theme.mp3', title: 'Rain on Old Vinyl', artist: 'Winter Jasmine', duration: 158.6155, cover: '/assets/img/music/rain-on-old-vinyl.webp' },
    { src: '/assets/aud/the_portrait.mp3', title: 'The Portrait', artist: 'James Horner', duration: 283.494943, cover: '/assets/img/music/back-to-titanic.jpg' },
  ];
  const songs = tracks.map(track => track.src);
  let userVolume = Math.min(1, Math.max(0, Number(localStorage.getItem('musicVolume') ?? 1) || 0));
  let sharedPlaying = false;
  let playbackRequest = 0;
  let loading = false;
  let playbackError = '';

  // theme.mp3 is mastered about 12 dB louder than the_portrait. Scale it down
  // so every background track sits at the same perceived level.
  const SONG_VOLUME = {
    '/assets/aud/theme.mp3': 0.25,
  };

  // Narration state is part of every volume calculation so a song change or
  // cross-tab handoff cannot accidentally restore full volume mid-sentence.
  const DUCK_FACTOR = 0.3;
  const DUCK_FLOOR = 0.06;
  let narrationSource = null;
  let songVolumeFadeFrame = null;

  function songLevel(song) {
    const key = SONG_VOLUME[song] != null ? song : normalizeSongPath(song);
    const configured = SONG_VOLUME[key];
    return typeof configured === 'number' ? configured : 1;
  }

  function targetSongVolume(song) {
    const level = songLevel(song);
    return userVolume * (narrationSource ? Math.max(DUCK_FLOOR, level * DUCK_FACTOR) : level);
  }

  function cancelSongVolumeFade() {
    if (songVolumeFadeFrame) cancelAnimationFrame(songVolumeFadeFrame);
    songVolumeFadeFrame = null;
  }

  function fadeSongVolume(target, duration, easing) {
    cancelSongVolumeFade();
    const from = music.volume;
    const started = performance.now();
    const ease = (progress) => {
      if (easing === 'inOut') {
        return progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      }
      return 1 - Math.pow(1 - progress, 3);
    };
    const step = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = ease(progress);
      music.volume = from + (target - from) * eased;
      if (progress < 1) {
        songVolumeFadeFrame = requestAnimationFrame(step);
        return;
      }
      songVolumeFadeFrame = null;
    };
    songVolumeFadeFrame = requestAnimationFrame(step);
  }

  function applySongVolume(song) {
    cancelSongVolumeFade();
    music.volume = targetSongVolume(song);
  }

  // Summary narration ducks the background music instead of pausing it: the
  // voice stays clearly audible, then the music returns to its own level when
  // the narration pauses or ends.
  function duckMusic(event) {
    narrationSource = event.detail || true;
    if (music.paused) return;
    fadeSongVolume(targetSongVolume(currentSongPath || music.src), 320, 'out');
  }
  function restoreMusic(event) {
    if (event.detail && narrationSource && event.detail !== narrationSource) return;
    narrationSource = null;
    fadeSongVolume(targetSongVolume(currentSongPath || music.src), 500, 'inOut');
  }
  window.addEventListener('view-summary-play', duckMusic);
  window.addEventListener('view-summary-pause', restoreMusic);

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
  let pendingSeek = null;
  let tickTimer = null;
  let lastTickSent = 0;
  const seenHandoffTokens = new Set();

  function getRandomSong() {
    const remaining = songs.filter(song => song !== currentSongPath);
    return remaining[Math.floor(Math.random() * remaining.length)] || songs[0];
  }

  function publishPlayerState() {
    const track = tracks.find(track => track.src === currentSongPath) || tracks[0];
    window.dispatchEvent(new CustomEvent('site-music-state', { detail: {
      track, playing: sharedPlaying, loading, error: playbackError,
      time: playbackTime(), duration: Number.isFinite(music.duration) && music.duration > 0 ? music.duration : track.duration,
      volume: userVolume,
    } }));
  }

  function setIcon(playing) {
    sharedPlaying = playing;
    if (!musicIcon) return;
    const icon = musicIcon.querySelector('i');
    if (playing) {
      icon.classList.add("fa-spin");
      musicIcon.setAttribute("aria-label", "Pause music");
    } else {
      icon.classList.remove("fa-spin");
      musicIcon.setAttribute("aria-label", "Play music");
    }
    musicIcon.removeAttribute('title');
    publishPlayerState();
  }

  function persistState(playing) {
    localStorage.setItem("musicPlaying", playing ? "true" : "false");
    if (playing) {
      localStorage.setItem("musicLeader", String(Date.now()));
    }
    if (music.src) {
      localStorage.setItem("currentSong", currentSongPath || music.src);
    }
    localStorage.setItem("musicTime", String(playbackTime()));
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

  function playbackTime() {
    return pendingSeek ?? (music.currentTime || 0);
  }

  function applyPendingSeek() {
    if (pendingSeek === null) return;
    try {
      music.currentTime = pendingSeek;
      // Keep the requested position until this source has metadata. Some
      // browsers accept an early seek and then reset it while loading.
      if (music.readyState > 0) pendingSeek = null;
    } catch (error) {
      // loadedmetadata retries the seek without losing the saved position.
    }
  }

  function adoptState(song, time) {
    if (song && (currentSongPath !== song || !music.src)) {
      pendingSeek = null;
      currentSongPath = song;
      music.src = song;
      applySongVolume(song);
    }
    if (typeof time === "number" && isFinite(time)) {
      pendingSeek = Math.max(0, time);
      applyPendingSeek();
    }
    publishPlayerState();
  }

  function startTicking() {
    if (tickTimer) return;
    tickTimer = setInterval(() => {
      localStorage.setItem("musicTime", String(playbackTime()));
      localStorage.setItem("musicLeader", String(Date.now()));
      const now = Date.now();
      if (now - lastTickSent >= 5000) {
        lastTickSent = now;
        broadcast({ type: "tick", song: currentSongPath, time: playbackTime() });
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
    const request = ++playbackRequest;
    loading = true;
    playbackError = '';
    // A user can change songs in a different tab. Release the old player
    // before the new one starts so the two tracks never overlap.
    broadcast({ type: 'claim' });
    // Starting audio consumes any pending handoff: this tab is now the leader.
    clearHandoff();
    adoptState(song, time);
    applySongVolume(currentSongPath || music.src);
    // Claim the leader slot before play() resolves so a concurrent successor
    // backs off instead of starting a second copy of the audio.
    persistState(true);
    setIcon(true);
    return music.play().then(() => {
      if (request !== playbackRequest) return;
      loading = false;
      setIcon(true);
      lastTickSent = Date.now();
      broadcast({ type: "play", song: currentSongPath, time: playbackTime() });
      startTicking();
      return true;
    }).catch(error => {
      if (request !== playbackRequest) return;
      loading = false;
      playbackError = 'Music could not play. Try again.';
      console.log("Autoplay prevented. Waiting for user interaction.");
      setIcon(false);
      persistState(false);
      return false;
    });
  }

  function playRandomSong() {
    startPlayback(getRandomSong());
  }

  function pauseMusic() {
    playbackRequest++;
    loading = false;
    if (music.paused) {
      adoptState(normalizeSongPath(localStorage.getItem('currentSong')), parseFloat(localStorage.getItem('musicTime')));
    }
    music.pause();
    setIcon(false);
    persistState(false);
    broadcast({ type: "pause" });
    stopTicking();
    clearHandoff();
  }

  // Another tab started, paused, or advanced playback. Mirror the shared
  // state here without duplicating the audio. The icon always reflects the
  // global playback state, and the local element follows the leader's
  // position so any tab can take over seamlessly.
  function handleRemote(message) {
    if (!message || typeof message !== "object") return;
    if (message.type === 'claim') {
      playbackRequest++;
      music.pause();
      stopTicking();
    } else if (message.type === "play") {
      playbackRequest++;
      loading = false;
      playbackError = '';
      if (!music.paused) music.pause();
      stopTicking();
      adoptState(message.song, message.time);
      setIcon(true);
    } else if (message.type === "pause") {
      playbackRequest++;
      loading = false;
      const wasPlaying = !music.paused;
      music.pause();
      stopTicking();
      setIcon(false);
      if (wasPlaying) {
        // The leader has a newer position than a follower's last tick.
        persistState(false);
        broadcast({ type: 'paused', song: currentSongPath, time: playbackTime() });
      }
    } else if (message.type === 'paused') {
      adoptState(message.song, message.time);
      setIcon(false);
    } else if (message.type === "tick") {
      if (music.paused) {
        adoptState(message.song, message.time);
      }
    } else if (message.type === "takeover") {
      tryTakeoverPlayback();
    } else if (message.type === 'selection') {
      adoptState(normalizeSongPath(message.song), message.time);
      setIcon(false);
    } else if (message.type === 'volume') {
      userVolume = Math.min(1, Math.max(0, Number(message.volume) || 0));
      applySongVolume(currentSongPath);
      publishPlayerState();
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
      time: typeof time === "number" ? time : playbackTime(),
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
    return startPlayback(handoff.song, handoff.time).then(started => {
      if (started !== false) return;
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
          if (current) return startTakeoverPlayback(current);
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
    if (event.key === 'musicVolume') {
      userVolume = Math.min(1, Math.max(0, Number(event.newValue) || 0));
      applySongVolume(currentSongPath);
      publishPlayerState();
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
  } else {
    // Choose the first song before displaying its cover. Play then starts
    // that exact recording, without replacing the card's title or artwork.
    currentSongPath = getRandomSong();
  }

  // The icon reflects the shared playback state, not this tab's own audio.
  setIcon(musicPlaying && anotherTabPlaying);

  window.addEventListener('site-music-request', publishPlayerState);
  window.addEventListener('site-music-command', event => {
    const command = event.detail || {};
    if (command.action === 'pause') {
      pauseMusic();
    } else if (command.action === 'toggle') {
      musicIcon.click();
    } else if (command.action === 'next' || command.action === 'previous') {
      const index = songs.indexOf(currentSongPath || songs[0]);
      const offset = command.action === 'next' ? 1 : -1;
      const song = songs[(index + offset + songs.length) % songs.length];
      if (sharedPlaying) startPlayback(song, 0);
      else {
        adoptState(song, 0);
        persistState(false);
        broadcast({ type: 'selection', song, time: 0 });
      }
    } else if (command.action === 'seek') {
      const track = tracks.find(track => track.src === currentSongPath) || tracks[0];
      const time = Math.min(track.duration, Math.max(0, Number(command.time) || 0));
      if (sharedPlaying && music.paused) startPlayback(track.src, time);
      else {
        adoptState(track.src, time);
        persistState(sharedPlaying);
        broadcast({ type: sharedPlaying ? 'tick' : 'selection', song: track.src, time });
      }
    } else if (command.action === 'volume') {
      userVolume = Math.min(1, Math.max(0, Number(command.volume) || 0));
      localStorage.setItem('musicVolume', String(userVolume));
      applySongVolume(currentSongPath);
      broadcast({ type: 'volume', volume: userVolume });
      publishPlayerState();
    }
  });
  music.addEventListener('loadedmetadata', () => { applyPendingSeek(); publishPlayerState(); });
  ['timeupdate', 'durationchange'].forEach(event => music.addEventListener(event, publishPlayerState));
  music.addEventListener('waiting', () => { loading = sharedPlaying; publishPlayerState(); });
  music.addEventListener('playing', () => { loading = false; publishPlayerState(); });

  musicIcon.addEventListener("click", function() {
    // Global toggle: the button controls the shared player, so clicking it in
    // any window pauses or starts the same playback.
    const globalPlaying = localStorage.getItem("musicPlaying") === "true";
    if (!globalPlaying) {
      if (!music.src) {
        startPlayback(currentSongPath || getRandomSong(), 0);
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
    playbackRequest++;
    music.pause();
    stopTicking();
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
  if (musicPlaying && savedSong && !anotherTabPlaying && !freshHandoff()) {
    startPlayback(savedSong, savedTime);
  }

  // A tab that reloads after playing, or a tab opened right after the last one
  // closed, inherits the saved audio through the handoff.
  if (freshHandoff()) {
    window.setTimeout(() => tryTakeoverPlayback(), 300);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSiteMusic);
else initSiteMusic();

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
