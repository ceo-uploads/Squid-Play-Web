/* =========================    Data (replace iframe src)    ========================= */
const DATA = {
  seasons: [
    {
      season: 1,
      title: "Season 1",
      episodes: [
        { number: 1, title: "Red Light, Green Light", desc: "456 players. One deadly game begins.", iframe: "https://player.example.com/embed/s1e1" },
        { number: 2, title: "Hell", desc: "Choices are made; stakes revealed.", iframe: "https://player.example.com/embed/s1e2" },
        { number: 3, title: "The Man with the Umbrella", desc: "Sugar, shapes, and sharp edges.", iframe: "https://player.example.com/embed/s1e3" },
        { number: 4, title: "Stick to the Team", desc: "Strength, strategy, survival.", iframe: "https://player.example.com/embed/s1e4" },
      ],
    },
    {
      season: 2,
      title: "Season 2",
      episodes: [
        { number: 1, title: "Return to the Arena", desc: "Old debts, new dangers.", iframe: "https://player.example.com/embed/s2e1" },
        { number: 2, title: "Alliances", desc: "Who can you trust?", iframe: "https://player.example.com/embed/s2e2" },
        { number: 3, title: "Betrayal", desc: "Lines are crossed.", iframe: "https://player.example.com/embed/s2e3" },
        { number: 4, title: "The Fall", desc: "Towers tumble.", iframe: "https://player.example.com/embed/s2e4" },
      ],
    },
    {
      season: 3,
      title: "Season 3",
      episodes: [
        { number: 1, title: "New Rules", desc: "Everything changes.", iframe: "https://www.youtube.com/embed/hEd4eFBi_0Q?si=SrQJ2FE6wzkPMbix" },
        { number: 2, title: "The Hunt", desc: "Predators and prey.", iframe: "SQ3/Squid.Game.S03E02.mkv" },
        { number: 3, title: "Checkmate", desc: "Mind over matter.", iframe: "SQ3/Squid.Game.S03E03.mkv" },
        { number: 4, title: "Death Game", desc: "Only survives if alive.", iframe: "SQ3/Squid.Game.S03E04.mkv" },
        { number: 5, title: "Front Man Reveal", desc: "Team Elimination.", iframe: "SQ3/Squid.Game.S03E05.mkv" },
        { number: 6, title: "Endgame", desc: "456 death", iframe: "SQ3/Squid.Game.S03E06.mkv" },
      ],
    },
  ],
};


/* =========================
   Utilities
   ========================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function getEpisodeKey(season, number) {
  return `ep_${season}_${number}`;
}

function getEpisodeByParams(season, number) {
  const s = DATA.seasons.find((s) => s.season === Number(season));
  if (!s) return null;
  const e = s.episodes.find((e) => e.number === Number(number));
  return e ? { season: s.season, ...e } : null;
}

/* =========================
   Home (index.html) logic
   ========================= */
const squidWrapper = document.querySelector(".squid-army-wrapper");
const squidImg = document.querySelector(".squid-army");
const sgTitle = document.querySelector(".sg-title");

let currentOffsetImg = 0;
let targetOffsetImg = 0;
let currentOffsetTitle = 0;
let targetOffsetTitle = 0;

function parallaxLoop() {
  const scrollY = window.scrollY;

  // Squid Army parallax (slow)
  targetOffsetImg = scrollY * 0.15;
  currentOffsetImg += (targetOffsetImg - currentOffsetImg) * 0.08;
  if (squidWrapper) {
    squidWrapper.style.transform = `translateY(${currentOffsetImg}px) scale(1.02)`;
  }

  // Title parallax (faster, moves upward more)
  targetOffsetTitle = scrollY * 0.35;
  currentOffsetTitle += (targetOffsetTitle - currentOffsetTitle) * 0.1;
  if (sgTitle) {
    sgTitle.style.transform = `translateY(${50 - currentOffsetTitle}px)`; // start from 50px
  }

  requestAnimationFrame(parallaxLoop);
}

parallaxLoop();

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll(".reveal-on-scroll")
  .forEach((el) => revealObserver.observe(el));

function renderSeasons() {
  const mount = document.getElementById("seasonsContainer");
  if (!mount) return;

  DATA.seasons.forEach((seasonObj) => {
    const block = document.createElement("section");
    block.className = "season-block reveal-on-scroll";

    block.innerHTML = `
      <div class="season-head">
        <h3>${seasonObj.title}</h3>
        <div class="sub muted">Hindi Dub • ${seasonObj.episodes.length} episodes</div>
      </div>

      <div class="scroller">
        <button class="scroll-btn left" aria-label="Scroll left">‹</button>
        <div class="episodes-row"></div>
        <button class="scroll-btn right" aria-label="Scroll right">›</button>
      </div>
    `;

    const row = $(".episodes-row", block);

    seasonObj.episodes.forEach((ep) => {
      const id = getEpisodeKey(seasonObj.season, ep.number);
      const card = document.createElement("article");
      card.className = "card-ep";

      /* Render iframe preview with overlay */
      card.innerHTML = `
        <div class="frame">
          <iframe src="${ep.iframe}" title="S${seasonObj.season}E${ep.number} — ${ep.title}" allowfullscreen loading="lazy" referrerpolicy="no-referrer"></iframe>
          <a class="overlay-link" href="episode.html?s=${seasonObj.season}&e=${ep.number}">
            <span class="play-pill"><span class="dot"></span> Play</span>
          </a>
        </div>
        <div class="meta">
          <div>
            <div class="title">S${seasonObj.season} • E${ep.number} — ${ep.title}</div>
            <div class="sub">${ep.desc}</div>
          </div>
        </div>
      `;

      row.appendChild(card);
    });

    // Scroll controls
    const left = $(".scroll-btn.left", block);
    const right = $(".scroll-btn.right", block);
    const scrollBy = () => Math.min(row.clientWidth * 0.9, 600);

    left.addEventListener("click", () =>
      row.scrollBy({ left: -scrollBy(), behavior: "smooth" })
    );
    right.addEventListener("click", () =>
      row.scrollBy({ left: scrollBy(), behavior: "smooth" })
    );

    mount.appendChild(block);
  });
}

/* =========================
   Episode (episode.html) logic
   ========================= */
function initEpisodePage() {
  if (!$("#iframeMount")) return;

  const params = new URLSearchParams(location.search);
  const s = params.get("s");
  const e = params.get("e");
  const ep = getEpisodeByParams(s, e);

  if (!ep) {
    $("#iframeMount").innerHTML = `<div style="padding:20px">Episode not found.</div>`;
    return;
  }

  // Populate UI
  $("#epTitle").textContent = `S${ep.season} • E${ep.number} — ${ep.title}`;
  $("#epDesc").textContent = ep.desc;
  $("#epSeason").textContent = ep.season;
  $("#epNumber").textContent = ep.number;

  // Lazy load iframe on Play click
  const playBtn = document.getElementById("playBtn");
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      const mount = document.getElementById("iframeMount");
      mount.innerHTML = ""; // clear placeholder

      const iframe = document.createElement("iframe");
      iframe.src = ep.iframe;
      iframe.allowFullscreen = true;
      iframe.style.width = "100%";
      iframe.style.height = "500px";
      iframe.setAttribute("frameborder", "0");

      mount.appendChild(iframe);
    });
  }

  // Likes/Dislikes (localStorage)
  const storageKey = getEpisodeKey(ep.season, ep.number);
  const state = JSON.parse(
    localStorage.getItem(storageKey) || '{"likes":0,"dislikes":0,"status":""}'
  );
  const likeBtn = $("#likeBtn"),
    dislikeBtn = $("#dislikeBtn");
  const likeCount = $("#likeCount"),
    dislikeCount = $("#dislikeCount");

  likeCount.textContent = state.likes;
  dislikeCount.textContent = state.dislikes;

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function setActive(btn, active) {
    btn.style.borderColor = active
      ? "rgba(255,255,255,.6)"
      : "rgba(255,255,255,.18)";
  }

  setActive(likeBtn, state.status === "like");
  setActive(dislikeBtn, state.status === "dislike");

  likeBtn.addEventListener("click", () => {
    if (state.status === "like") {
      state.status = "";
      state.likes = Math.max(0, state.likes - 1);
    } else {
      if (state.status === "dislike") {
        state.dislikes = Math.max(0, state.dislikes - 1);
      }
      state.status = "like";
      state.likes += 1;
    }
    likeCount.textContent = state.likes;
    dislikeCount.textContent = state.dislikes;
    setActive(likeBtn, state.status === "like");
    setActive(dislikeBtn, state.status === "dislike");
    save();
  });

  dislikeBtn.addEventListener("click", () => {
    if (state.status === "dislike") {
      state.status = "";
      state.dislikes = Math.max(0, state.dislikes - 1);
    } else {
      if (state.status === "like") {
        state.likes = Math.max(0, state.likes - 1);
      }
      state.status = "dislike";
      state.dislikes += 1;
    }
    likeCount.textContent = state.likes;
    dislikeCount.textContent = state.dislikes;
    setActive(likeBtn, state.status === "like");
    setActive(dislikeBtn, state.status === "dislike");
    save();
  });

  // Share
  $("#shareBtn").addEventListener("click", () => {
    const shareUrl = location.href; // current episode page URL
    window.location.href = `share.html?url=${encodeURIComponent(shareUrl)}`;
  });

  // Render "More from this season"
  const moreMount = $("#moreContainer");
  const season = DATA.seasons.find((x) => x.season === ep.season);
  season.episodes.forEach((item) => {
    const a = document.createElement("a");
    a.href = `episode.html?s=${season.season}&e=${item.number}`;
    a.className = "card-ep";
    a.innerHTML = `
  <div class="frame lazy-ep" data-src="${item.iframe}">
    <span class="overlay-link"><span class="play-pill"><span class="dot"></span>Play</span></span>
  </div>
  <div class="meta">
    <div>
      <div class="title">E${item.number} — ${item.title}</div>
      <div class="sub">${item.desc}</div>
    </div>
  </div>
`;

    moreMount.appendChild(a);
  });

  // Lazy-load preview if clicked
  document.addEventListener("click", (e) => {
    const frame = e.target.closest(".lazy-ep");
    if (frame && !frame.querySelector("iframe")) {
      const src = frame.getAttribute("data-src");
      frame.innerHTML = `
      <iframe src="${src}" allowfullscreen style="width:100%; height:200px;" frameborder="0"></iframe>
    `;
    }
  });
}

/* =========================
   Effects: reveal + cursor
   ========================= */
function initReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("reveal-active");
          obs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15 }
  );

  $$(".reveal-on-scroll").forEach((el) => obs.observe(el));
}

function initCursor() {
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  if (!dot || !ring) return;

  let x = window.innerWidth / 2,
    y = window.innerHeight / 2;
  let rx = x,
    ry = y;

  window.addEventListener(
    "mousemove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.left = x + "px";
      dot.style.top = y + "px";
    },
    { passive: true }
  );

  function loop() {
    rx += (x - rx) * 0.15;
    ry += (y - ry) * 0.15;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  }
  loop();

  ["a", "button", ".overlay-link", ".card-ep"].forEach((sel) => {
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(sel)) {
        ring.style.width = "54px";
        ring.style.height = "54px";
        ring.style.opacity = "1";
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(sel)) {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.opacity = ".7";
      }
    });
  });

  window.addEventListener("mousedown", () => {
    ring.style.transform = "translate(-50%, -50%) scale(2)";
    ring.style.opacity = "0.4";
  });

  window.addEventListener("mouseup", () => {
    ring.style.transform = "translate(-50%, -50%) scale(1)";
    ring.style.opacity = "0.7";
  });
}

/* =========================
   Boot
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderSeasons();
  initEpisodePage();
  initReveal();
  initCursor();
});
