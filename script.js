// ---------- album data ----------
// Para adicionar as faixas: coloque o .mp3 e o .txt da letra dentro de /songs
// com o MESMO nome de base indicado abaixo (só muda a extensão).
const ALBUM = {
  title: "Wolfborn",
  artist: "Wolfborn",
  cover: "assets/cover.png",
  tracks: [
    { title: "Born of Steel and Thunder", base: "songs/01 - Born of Steel and Thunder" },
    { title: "Escape the Shadow",         base: "songs/02 - Escape the Shadow" },
    { title: "Wolfborn",                  base: "songs/03 - Wolfborn" },
    { title: "Fear the Dark",             base: "songs/04 - Fear the Dark" },
  ]
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// ---------- state ----------
let currentIndex = -1;
let isPlaying = false;
const lyricsCache = {};

// ---------- dom ----------
const audio = document.getElementById("audio");
const tracklistEl = document.getElementById("tracklist");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");

// ---------- build tracklist ----------
function renderTracklist() {
  ALBUM.tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.className = "track";
    li.dataset.index = index;

    li.innerHTML = `
      <div class="track__row" role="button" tabindex="0" aria-label="Reproduzir ${track.title}">
        <span class="track__num">${ROMAN[index] || index + 1}</span>
        <span class="track__title">${track.title}</span>
        <span class="track__duration" data-role="duration">--:--</span>
        <button class="track__lyrics-toggle" type="button" aria-expanded="false">Letra</button>
      </div>
      <div class="track__lyrics">
        <div class="track__lyrics-inner" data-role="lyrics-text">Carregando letra...</div>
      </div>
    `;

    const row = li.querySelector(".track__row");
    row.addEventListener("click", (e) => {
      if (e.target.closest(".track__lyrics-toggle")) return;
      selectTrack(index, true);
    });
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectTrack(index, true);
      }
    });

    const toggleBtn = li.querySelector(".track__lyrics-toggle");
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLyrics(index);
    });

    // probe duration without loading the whole file
    const probe = new Audio();
    probe.preload = "metadata";
    probe.src = track.base + ".mp3";
    probe.addEventListener("loadedmetadata", () => {
      const el = li.querySelector('[data-role="duration"]');
      if (el && isFinite(probe.duration)) el.textContent = formatTime(probe.duration);
    });

    tracklistEl.appendChild(li);
  });
}

function getTrackEl(index) {
  return tracklistEl.querySelector(`.track[data-index="${index}"]`);
}

// ---------- lyrics ----------
async function toggleLyrics(index) {
  const li = getTrackEl(index);
  const panel = li.querySelector(".track__lyrics");
  const btn = li.querySelector(".track__lyrics-toggle");
  const textEl = li.querySelector('[data-role="lyrics-text"]');
  const isOpen = panel.classList.contains("is-open");

  if (isOpen) {
    panel.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    return;
  }

  panel.classList.add("is-open");
  btn.setAttribute("aria-expanded", "true");

  if (lyricsCache[index]) {
    textEl.textContent = lyricsCache[index];
    return;
  }

  const track = ALBUM.tracks[index];
  try {
    const res = await fetch(track.base + ".txt");
    if (!res.ok) throw new Error("not found");
    const text = await res.text();
    lyricsCache[index] = text;
    textEl.textContent = text;
  } catch (err) {
    textEl.textContent =
      "Não foi possível carregar a letra. Confira se o arquivo \"" +
      track.base.split("/").pop() +
      '.txt" existe na pasta /songs, e sirva o site por http (GitHub Pages ou um servidor local) — abrir o index.html direto do disco bloqueia esse carregamento.';
  }
}

// ---------- playback ----------
function selectTrack(index, autoplay) {
  currentIndex = index;
  const track = ALBUM.tracks[index];

  audio.src = track.base + ".mp3";
  nowPlayingTitle.textContent = track.title;
  document.title = `${track.title} — ${ALBUM.title}`;

  [...tracklistEl.children].forEach((li) => li.classList.remove("track--active"));
  getTrackEl(index).classList.add("track--active");

  seekBar.disabled = false;
  prevBtn.disabled = false;
  nextBtn.disabled = false;
  playBtn.disabled = false;

  if (autoplay) {
    audio.play().catch(() => {});
  }

  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: ALBUM.artist,
      album: ALBUM.title,
      artwork: [{ src: ALBUM.cover, sizes: "1254x1254", type: "image/png" }],
    });
  }
}

function playPause() {
  if (currentIndex === -1) {
    selectTrack(0, true);
    return;
  }
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function playNext() {
  if (currentIndex === -1) return;
  const next = (currentIndex + 1) % ALBUM.tracks.length;
  selectTrack(next, true);
}

function playPrev() {
  if (currentIndex === -1) return;
  const prev = (currentIndex - 1 + ALBUM.tracks.length) % ALBUM.tracks.length;
  selectTrack(prev, true);
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// ---------- events ----------
playBtn.addEventListener("click", playPause);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

audio.addEventListener("play", () => {
  isPlaying = true;
  playIcon.hidden = true;
  pauseIcon.hidden = false;
  playBtn.setAttribute("aria-label", "Pausar");
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playIcon.hidden = false;
  pauseIcon.hidden = true;
  playBtn.setAttribute("aria-label", "Reproduzir");
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (isFinite(audio.duration) && audio.duration > 0) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

audio.addEventListener("ended", playNext);

seekBar.addEventListener("input", () => {
  if (isFinite(audio.duration)) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});

if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("play", playPause);
  navigator.mediaSession.setActionHandler("pause", playPause);
  navigator.mediaSession.setActionHandler("previoustrack", playPrev);
  navigator.mediaSession.setActionHandler("nexttrack", playNext);
}

// ---------- init ----------
audio.volume = volumeBar.value / 100;
renderTracklist();
