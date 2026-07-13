/* ============================================
   Anniversary Love Story — Interactions
   Modular vanilla JS · 60fps-friendly
   ============================================ */

(() => {
  "use strict";

  /* ---------- Config (edit these) ---------- */
  const CONFIG = {
    // Together-for counter start: July 20, 2025 at midnight
    anniversaryDate: new Date("2025-07-20T00:00:00"),
    // Site unlock: midnight starting July 20, 2026 (IST) — anniversary day
    unlockAt: new Date("2026-07-20T00:00:00+05:30"),
    loaderMs: 2000,
    floatingMessages: [
      "I love you",
      "You’re my favorite",
      "Always",
      "My heart",
      "Forever us",
      "Miss your smile",
    ],
    reasons: [
      "You’re hardworking, strong, and so focused on your goals — watching you study and hustle makes me fall for you every single day.",
      "You work out every day and it shows… you’re insanely sexy, and I can’t stop staring.",
      "You have a real family mindset — soft where it matters, solid where it counts. Building a life with you just feels right.",
      "You don’t complain, you don’t nag — you just support me. That kind of love is rare, and I’m so lucky it’s yours.",
      "You’re beautiful and stylish without even trying. Every look, every outfit — you’re my favorite view.",
      "That body? Especially that perfect ass. And the way we fit together… the sex is unreal. You’re addictive.",
    ],
    noteMessages: [
      "You are my calm in every storm. Thank you for being you.",
      "Even on the busiest days, you’re the thought that softens everything.",
      "My favorite person in every room — always.",
      "Forever isn’t long enough with you, but I’ll take every second.",
      "Thank you for choosing us, again and again.",
      "You make my heart soft in the best way.",
    ],
    letterText:
      "My love,\n\nHappy first anniversary. A year ago, I didn’t know how deeply someone could rewrite the meaning of home — and then you did. You’ve filled my days with warmth, laughter, and a kind of quiet certainty I never want to lose.\n\nThank you for every soft morning, every late-night talk, every time you believed in me when I struggled to believe in myself. This little website is only a fraction of what I feel — but I hope it makes you smile the way you make me smile every day.\n\nHere’s to us, to forever, and to every chapter still waiting.\n\nI love you more than words can hold.\n\nYours, always.",
    quiz: [
      {
        q: "Where was our first date?",
        options: ["Coffee shop", "Park", "Restaurant", "Bookstore"],
        answer: 0,
      },
      {
        q: "What’s my favorite thing about you?",
        options: ["Your smile", "Your kindness", "Your laugh", "Everything"],
        answer: 3,
      },
      {
        q: "Our go-to comfort food?",
        options: ["Pizza", "Ice cream", "Ramen", "Chocolate"],
        answer: 1,
      },
      {
        q: "Best trip memory so far?",
        options: ["Sunset walk", "Road trip playlist", "Rainy café", "All of them"],
        answer: 3,
      },
      {
        q: "How do I say I love you most?",
        options: ["Texts", "Hugs", "Little surprises", "All of the above"],
        answer: 3,
      },
    ],
    memoryIcons: ["🌸", "⭐", "🌙", "🦋", "💌", "🎀"],
  };

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- Loader ---------- */
  let loaderDone = false;
  let openingStarted = false;

  const startOpeningIfReady = () => {
    if (openingStarted || !loaderDone) return;
    if (document.body.classList.contains("is-locked")) return;
    openingStarted = true;
    document.body.style.overflow = "";
    initOpeningSequence();
  };

  /* ---------- Countdown site lock ---------- */
  function initSiteLock() {
    const lock = $("#siteLock");
    if (!lock) {
      document.body.classList.remove("is-locked");
      return;
    }

    const daysEl = $("#lockDays");
    const hoursEl = $("#lockHours");
    const minsEl = $("#lockMins");
    const secsEl = $("#lockSecs");
    const unlockAt = Number(CONFIG.unlockAt?.getTime?.() || 0);
    let unlocked = false;
    let timerId = 0;

    const pad = (n) => String(Math.max(0, Math.floor(n))).padStart(2, "0");

    const finishUnlock = () => {
      if (unlocked) return;
      unlocked = true;
      if (timerId) clearInterval(timerId);
      try {
        lock.classList.remove("is-opening");
        lock.remove();
      } catch (_) {
        /* already gone */
      }
      document.body.classList.remove("is-locked");
      document.body.style.overflow = "";
      startOpeningIfReady();
    };

    const openLock = () => {
      if (unlocked) return;
      if (lock.classList.contains("is-opening")) return;

      if (prefersReducedMotion()) {
        finishUnlock();
        return;
      }

      lock.classList.add("is-opening");
      // Always remove for real — don’t rely only on animation end
      setTimeout(finishUnlock, 1200);
      // Failsafe if something blocks the first timeout
      setTimeout(finishUnlock, 2500);
    };

    const tick = () => {
      if (unlocked) return false;
      if (!Number.isFinite(unlockAt)) {
        finishUnlock();
        return false;
      }

      const diff = unlockAt - Date.now();
      if (diff <= 0) {
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
        openLock();
        return false;
      }

      // ceil seconds so we don’t show 00 while still waiting the last second
      const totalSec = Math.max(1, Math.ceil(diff / 1000));
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      if (daysEl) daysEl.textContent = pad(d);
      if (hoursEl) hoursEl.textContent = pad(h);
      if (minsEl) minsEl.textContent = pad(m);
      if (secsEl) secsEl.textContent = pad(s);
      return true;
    };

    document.body.classList.add("is-locked");
    document.body.style.overflow = "hidden";

    if (!tick()) return;

    timerId = window.setInterval(() => {
      if (!tick()) clearInterval(timerId);
    }, 200);

    const block = (e) => {
      if (document.body.classList.contains("is-locked")) e.preventDefault();
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
  }

  function initLoader() {
    const loader = $("#loader");
    if (!loader) {
      loaderDone = true;
      startOpeningIfReady();
      return;
    }
    setTimeout(() => {
      loader.classList.add("is-done");
      loaderDone = true;
      startOpeningIfReady();
    }, CONFIG.loaderMs);
    document.body.style.overflow = "hidden";
  }

  /* ---------- Scroll progress ---------- */
  function initScrollProgress() {
    const fill = $("#scrollProgress");
    if (!fill) return;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      fill.style.width = `${pct}%`;
    };

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Intersection Observer reveals ---------- */
  function initReveals() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion()) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 0.06}s`;
      io.observe(el);
    });
  }

  /* ---------- Opening stars + sequence ---------- */
  function initStarsCanvas() {
    const canvas = $("#starsCanvas");
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    let stars = [];
    let shooting = [];
    let raf = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawnStars();
    };

    const spawnStars = () => {
      const count = Math.floor((canvas.clientWidth * canvas.clientHeight) / 9000);
      stars = Array.from({ length: clamp(count, 40, 120) }, () => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        s: Math.random() * 0.02 + 0.005,
      }));
    };

    const spawnShooting = () => {
      if (Math.random() > 0.008) return;
      shooting.push({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight * 0.4,
        len: 60 + Math.random() * 80,
        speed: 6 + Math.random() * 4,
        life: 1,
      });
    };

    const draw = () => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      stars.forEach((st) => {
        st.a += st.s;
        const alpha = 0.35 + Math.sin(st.a) * 0.45;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,245,230,${alpha})`;
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      });

      spawnShooting();
      shooting = shooting.filter((s) => s.life > 0);
      shooting.forEach((s) => {
        ctx.strokeStyle = `rgba(255,230,200,${s.life})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y + s.len * 0.35);
        ctx.stroke();
        s.x += s.speed;
        s.y += s.speed * 0.35;
        s.life -= 0.02;
      });

      raf = requestAnimationFrame(draw);
    };

    const section = $("#opening");
    const visIO = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (section) visIO.observe(section);

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();

    return () => cancelAnimationFrame(raf);
  }

  function initOpeningPetals() {
    const wrap = $("#openingPetals");
    if (!wrap || prefersReducedMotion()) return;
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${8 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.opacity = String(0.3 + Math.random() * 0.4);
      wrap.appendChild(p);
    }
  }

  function initOpeningSequence() {
    if (prefersReducedMotion()) {
      $$("[data-reveal]").forEach((el) => el.classList.add("is-shown"));
      $$(".opening__line, .opening__heart, .opening__sub, .opening__scroll, .opening__arrow").forEach(
        (el) => el.classList.add("is-shown")
      );
      return;
    }

    const titleLine = $(".opening__line");
    const heart = $(".opening__heart");
    const sub = $(".opening__sub");
    const scroll = $(".opening__scroll");
    const arrow = $(".opening__arrow");

    const show = (el, delay) => {
      if (!el) return;
      setTimeout(() => el.classList.add("is-shown"), delay);
    };

    show(titleLine, 300);
    show(heart, 900);
    show(sub, 2000);
    show(scroll, 3400);
    show(arrow, 3400);
  }

  /* ---------- Shared music player (dock + vinyl chapter) ---------- */
  function initMusicPlayer() {
    const audio = $("#ourSong");
    if (!audio) return;

    const dock = $("#musicDock");
    const dockToggle = $("#musicDockToggle");
    const dockPanel = $("#musicDockPanel");
    const dockTitle = $("#musicDockTitle");
    const dockArtist = $("#musicDockArtist");
    const dockPlay = $("#musicDockPlay");
    const dockPlayIcon = $("#musicDockPlayIcon");
    const dockPrev = $("#musicDockPrev");
    const dockNext = $("#musicDockNext");

    const playBtn = $("#vinylPlay");
    const prevBtn = $("#vinylPrev");
    const nextBtn = $("#vinylNext");
    const icon = $("#vinylPlayIcon");
    const disc = $("#vinylDisc");
    const progress = $("#vinylProgress");
    const progressBar = $("#vinylProgressBar");
    const titleEl = $("#vinylTitle");
    const artistEl = $("#vinylArtist");
    const listEl = $("#vinylPlaylist");

    const tracks = [
      {
        title: "party 4 u",
        artist: "Charli xcx",
        file: "Charli xcx - party 4 u (official video).mp3",
      },
      {
        title: "Princess",
        artist: "Feng",
        file: "Feng - Princess.mp3",
      },
      {
        title: "So Anxious",
        artist: "Ginuwine",
        file: "Ginuwine - So Anxious.mp3",
      },
      {
        title: "Beauty And A Beat",
        artist: "Justin Bieber ft. Nicki Minaj",
        file: "Justin Bieber - Beauty And A Beat (Official Music Video) ft. Nicki Minaj.mp3",
      },
      {
        title: "Good Days",
        artist: "SZA",
        file: "SZA - Good Days (Audio).mp3",
      },
      {
        title: "Style",
        artist: "Taylor Swift",
        file: "Taylor Swift - Style.mp3",
      },
      {
        title: "Wildest Dreams",
        artist: "Taylor Swift",
        file: "Taylor Swift - Wildest Dreams.mp3",
      },
      {
        title: "About You",
        artist: "The 1975",
        file: "The 1975 - About You (Official).mp3",
      },
      {
        title: "Every Breath You Take",
        artist: "The Police",
        file: "The Police - Every Breath You Take (Official Music Video).mp3",
      },
      {
        title: "Say It",
        artist: "Tory Lanez",
        file: "Tory Lanez Say It (Audio).mp3",
      },
    ];

    let index = 0;
    let raf = 0;

    const trackSrc = (file) => `assets/music/${encodeURIComponent(file)}`;

    const syncMeta = () => {
      const track = tracks[index];
      if (titleEl) titleEl.textContent = track.title;
      if (artistEl) artistEl.textContent = track.artist;
      if (dockTitle) dockTitle.textContent = track.title;
      if (dockArtist) dockArtist.textContent = track.artist;
    };

    const setPlayingUI = (playing) => {
      dock?.classList.toggle("is-playing", playing);
      disc?.classList.toggle("is-spinning", playing);

      playBtn?.setAttribute("aria-pressed", playing ? "true" : "false");
      playBtn?.setAttribute("aria-label", playing ? "Pause song" : "Play song");
      if (icon) icon.textContent = playing ? "❚❚" : "▶";

      dockPlay?.setAttribute("aria-pressed", playing ? "true" : "false");
      dockPlay?.setAttribute("aria-label", playing ? "Pause song" : "Play song");
      if (dockPlayIcon) dockPlayIcon.textContent = playing ? "❚❚" : "▶";

      listEl?.querySelectorAll(".vinyl-track").forEach((btn, i) => {
        btn.classList.toggle("is-active", i === index);
        btn.classList.toggle("is-playing", playing && i === index);
        btn.setAttribute("aria-current", i === index ? "true" : "false");
      });
    };

    const updateProgress = () => {
      if (audio.duration && progress) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${pct}%`;
        progressBar?.setAttribute("aria-valuenow", String(Math.round(pct)));
      }
      if (!audio.paused) raf = requestAnimationFrame(updateProgress);
    };

    const loadTrack = (i, { autoplay = false } = {}) => {
      index = (i + tracks.length) % tracks.length;
      syncMeta();
      if (progress) progress.style.width = "0%";
      progressBar?.setAttribute("aria-valuenow", "0");
      audio.src = trackSrc(tracks[index].file);
      audio.load();
      setPlayingUI(false);
      if (autoplay) playCurrent();
    };

    const playCurrent = async () => {
      try {
        await audio.play();
        setPlayingUI(true);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(updateProgress);
      } catch {
        setPlayingUI(false);
      }
    };

    const pauseCurrent = () => {
      audio.pause();
      setPlayingUI(false);
      cancelAnimationFrame(raf);
    };

    const togglePlay = () => {
      if (audio.paused) playCurrent();
      else pauseCurrent();
    };

    if (listEl) {
      listEl.innerHTML = "";
      tracks.forEach((track, i) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "vinyl-track";
        btn.innerHTML = `
          <span class="vinyl-track__num">${String(i + 1).padStart(2, "0")}</span>
          <span class="vinyl-track__info">
            <span class="vinyl-track__title">${track.title}</span>
            <span class="vinyl-track__artist">${track.artist}</span>
          </span>
          <span class="vinyl-track__wave" aria-hidden="true"></span>`;
        btn.addEventListener("click", () => {
          if (i === index && !audio.paused) pauseCurrent();
          else loadTrack(i, { autoplay: true });
        });
        li.appendChild(btn);
        listEl.appendChild(li);
      });
    }

    playBtn?.addEventListener("click", togglePlay);
    prevBtn?.addEventListener("click", () => loadTrack(index - 1, { autoplay: true }));
    nextBtn?.addEventListener("click", () => loadTrack(index + 1, { autoplay: true }));

    dockPlay?.addEventListener("click", togglePlay);
    dockPrev?.addEventListener("click", () => loadTrack(index - 1, { autoplay: true }));
    dockNext?.addEventListener("click", () => loadTrack(index + 1, { autoplay: true }));

    dockToggle?.addEventListener("click", () => {
      const open = dockPanel?.hasAttribute("hidden");
      if (!dockPanel) return;
      if (open) {
        dockPanel.hidden = false;
        dockPanel.removeAttribute("hidden");
        dockToggle.setAttribute("aria-expanded", "true");
        dockToggle.setAttribute("aria-label", "Close music controls");
      } else {
        dockPanel.hidden = true;
        dockPanel.setAttribute("hidden", "");
        dockToggle.setAttribute("aria-expanded", "false");
        dockToggle.setAttribute("aria-label", "Open music controls");
      }
    });

    progressBar?.addEventListener("click", (e) => {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      audio.currentTime = ratio * audio.duration;
      if (progress) progress.style.width = `${ratio * 100}%`;
    });

    audio.addEventListener("ended", () => {
      loadTrack(index + 1, { autoplay: true });
    });

    loadTrack(0);
  }

  /* ---------- Tap hearts + ripples ---------- */
  function initTapEffects() {
    const layer = $("#tapHearts");
    document.addEventListener(
      "pointerdown",
      (e) => {
        if (e.target.closest("button, a, input, canvas, .sticky-note, .reason-card, .gallery__item")) {
          spawnRipple(e);
        }
        if (!layer) return;
        if (Math.random() > 0.55) return;
        const heart = document.createElement("span");
        heart.className = "tap-heart";
        heart.textContent = ["❤️", "💕", "✨", "💗"][Math.floor(Math.random() * 4)];
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        layer.appendChild(heart);
        setTimeout(() => heart.remove(), 900);
      },
      { passive: true }
    );
  }

  function spawnRipple(e) {
    const target = e.target.closest("button, .sticky-note, .reason-card, .gallery__item");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    const prev = getComputedStyle(target).position;
    if (prev === "static") target.style.position = "relative";
    target.style.overflow = "hidden";
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  /* ---------- Floating love messages ---------- */
  function initFloatingMessages() {
    const layer = $("#floatingMessages");
    if (!layer || prefersReducedMotion()) return;

    layer.setAttribute("aria-hidden", "false");

    const loveEmojis = ["💕", "💖", "💗", "💓", "💞", "💘", "❤️", "🥰"];

    const popMsg = (msg) => {
      if (msg.classList.contains("is-popped")) return;
      msg.classList.add("is-popped");
      msg.textContent = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
      msg.setAttribute("aria-label", "Love");
      setTimeout(() => msg.remove(), 900);
    };

    const spawn = () => {
      const msg = document.createElement("button");
      msg.type = "button";
      msg.className = "float-msg";
      msg.textContent =
        CONFIG.floatingMessages[Math.floor(Math.random() * CONFIG.floatingMessages.length)];
      msg.setAttribute("aria-label", `Pop open: ${msg.textContent}`);
      msg.style.left = `${10 + Math.random() * 70}%`;
      msg.style.top = `${20 + Math.random() * 60}%`;
      msg.addEventListener("click", (e) => {
        e.stopPropagation();
        popMsg(msg);
      });
      layer.appendChild(msg);
      setTimeout(() => {
        if (!msg.classList.contains("is-popped")) msg.remove();
      }, 6000);
    };

    setInterval(spawn, 7000);
    setTimeout(spawn, 3500);
  }

  /* ---------- Timeline line fill ---------- */
  function initTimeline() {
    const timeline = $("#timeline");
    const fill = $("#timelineFill");
    if (!timeline || !fill) return;

    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.75;
      const end = -rect.height + viewH * 0.35;
      const progress = clamp((start - rect.top) / (start - end), 0, 1);
      fill.style.height = `${progress * 100}%`;
    };

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Gallery modal ---------- */
  function initGallery() {
    const modal = $("#galleryModal");
    const img = $("#galleryModalImg");
    const caption = $("#galleryModalCaption");
    const closeBtn = $("#galleryClose");
    if (!modal) return;

    const open = (src, cap, alt) => {
      img.src = src;
      img.alt = alt || "";
      caption.textContent = cap || "";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      img.src = "";
    };

    $$(".gallery__item").forEach((btn) => {
      btn.addEventListener("click", () => {
        open(btn.dataset.src, btn.dataset.caption, btn.querySelector("img")?.alt);
      });
    });

    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ---------- Spicy fog / heat section ---------- */
  function initSpicy() {
    const frame = $("#spicyFrame");
    const canvas = $("#spicyFog");
    const hint = $("#spicyHint");
    const heatFill = $("#spicyHeatFill");
    const heatPct = $("#spicyHeatPct");
    const line = $("#spicyLine");
    const holdBtn = $("#spicyHold");
    const compliments = $$("#spicyCompliments li");
    const embers = $("#spicyEmbers");
    if (!frame || !canvas) return;

    const lines = [
      "She’s looking dangerous tonight…",
      "Careful — she’s too sexy for this fog.",
      "Those curves should be illegal.",
      "My favorite kind of trouble.",
      "Still blurry… still breathtaking.",
      "Hottest girl in every room. Always.",
      "I can’t stop staring. Won’t apologize.",
    ];

    // Floating embers
    if (embers && !prefersReducedMotion()) {
      for (let i = 0; i < 12; i++) {
        const e = document.createElement("span");
        e.className = "spicy-ember";
        e.style.left = `${Math.random() * 100}%`;
        e.style.animationDuration = `${6 + Math.random() * 8}s`;
        e.style.animationDelay = `${Math.random() * 6}s`;
        e.style.width = e.style.height = `${2 + Math.random() * 4}px`;
        embers.appendChild(e);
      }
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let cssW = 0;
    let cssH = 0;
    let heat = 0;
    let wiping = false;
    let lastLineIdx = 0;
    let fogRaf = 0;
    let holdTimer = null;

    const resizeFog = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = frame.clientWidth;
      cssH = frame.clientHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFogFull();
    };

    const paintFogFull = () => {
      // Steamy glass base
      const g = ctx.createLinearGradient(0, 0, cssW, cssH);
      g.addColorStop(0, "rgba(255, 220, 230, 0.72)");
      g.addColorStop(0.45, "rgba(255, 180, 200, 0.78)");
      g.addColorStop(1, "rgba(80, 30, 50, 0.55)");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cssW, cssH);

      // Soft noise / condensation blobs
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * cssW;
        const y = Math.random() * cssH;
        const r = 20 + Math.random() * 50;
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, "rgba(255,255,255,0.22)");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(42, 16, 28, 0.35)";
      ctx.font = "600 15px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("STEAMY GLASS", cssW / 2, cssH * 0.42);
    };

    const wipeAt = (x, y) => {
      ctx.globalCompositeOperation = "destination-out";
      // Soft finger wipe — clears fog but photo stays blurred via CSS
      const rg = ctx.createRadialGradient(x, y, 0, x, y, 28);
      rg.addColorStop(0, "rgba(0,0,0,0.85)");
      rg.addColorStop(0.55, "rgba(0,0,0,0.35)");
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      heat = clamp(heat + 0.9, 0, 100);
      updateHeatUI();
    };

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return {
        x: ((p.clientX - rect.left) / rect.width) * cssW,
        y: ((p.clientY - rect.top) / rect.height) * cssH,
      };
    };

    const updateHeatUI = () => {
      if (heatFill) heatFill.style.width = `${heat}%`;
      if (heatPct) heatPct.textContent = `${Math.round(heat)}%`;

      frame.classList.toggle("is-heating", heat > 25);
      frame.classList.toggle("is-peak", heat > 70);

      compliments.forEach((li) => {
        const need = Number(li.dataset.heat) || 0;
        if (heat >= need) li.classList.add("is-unlocked");
      });

      const idx = clamp(Math.floor(heat / 16), 0, lines.length - 1);
      if (line && idx !== lastLineIdx) {
        lastLineIdx = idx;
        line.textContent = lines[idx];
        line.classList.remove("is-pop");
        void line.offsetWidth;
        line.classList.add("is-pop");
      }
    };

    // Steam slowly returns — the tease never fully clears
    const reFog = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(255, 200, 215, 0.035)";
      ctx.fillRect(0, 0, cssW, cssH);

      // Soft blob condensation drift
      if (Math.random() > 0.7) {
        const x = Math.random() * cssW;
        const y = Math.random() * cssH;
        const rg = ctx.createRadialGradient(x, y, 0, x, y, 40);
        rg.addColorStop(0, "rgba(255,255,255,0.04)");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
      }

      // Natural heat cool-down when not wiping
      if (!wiping && !holdTimer) {
        heat = clamp(heat - 0.08, 0, 100);
        updateHeatUI();
      }

      fogRaf = requestAnimationFrame(reFog);
    };

    const startWipe = (e) => {
      wiping = true;
      hint?.classList.add("is-hidden");
      const p = getPos(e);
      wipeAt(p.x, p.y);
      e.preventDefault();
    };

    const moveWipe = (e) => {
      if (!wiping) return;
      const p = getPos(e);
      wipeAt(p.x, p.y);
      // Spawn tiny spark hearts occasionally
      if (Math.random() > 0.85) {
        const layer = $("#tapHearts");
        if (layer) {
          const rect = canvas.getBoundingClientRect();
          const pt = e.touches ? e.touches[0] : e;
          const s = document.createElement("span");
          s.className = "tap-heart";
          s.textContent = ["🔥", "💋", "❤️"][Math.floor(Math.random() * 3)];
          s.style.left = `${pt.clientX}px`;
          s.style.top = `${pt.clientY}px`;
          layer.appendChild(s);
          setTimeout(() => s.remove(), 900);
        }
      }
      e.preventDefault();
    };

    const endWipe = () => {
      wiping = false;
    };

    canvas.addEventListener("mousedown", startWipe);
    canvas.addEventListener("mousemove", moveWipe);
    window.addEventListener("mouseup", endWipe);
    canvas.addEventListener("touchstart", startWipe, { passive: false });
    canvas.addEventListener("touchmove", moveWipe, { passive: false });
    canvas.addEventListener("touchend", endWipe);

    // Hold button — temporary heat spike, still never fully clear
    if (holdBtn) {
      const startHold = (e) => {
        e.preventDefault();
        holdBtn.classList.add("is-pressed");
        hint?.classList.add("is-hidden");
        holdTimer = setInterval(() => {
          heat = clamp(heat + 2.2, 0, 100);
          updateHeatUI();
          // Soften fog a bit while holding
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "rgba(0,0,0,0.04)";
          ctx.fillRect(0, 0, cssW, cssH);
          ctx.globalCompositeOperation = "source-over";
        }, 50);
      };
      const endHold = () => {
        holdBtn.classList.remove("is-pressed");
        if (holdTimer) {
          clearInterval(holdTimer);
          holdTimer = null;
        }
      };
      holdBtn.addEventListener("pointerdown", startHold);
      holdBtn.addEventListener("pointerup", endHold);
      holdBtn.addEventListener("pointerleave", endHold);
      holdBtn.addEventListener("pointercancel", endHold);
    }

    // Init when section is near viewport (correct canvas size)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          resizeFog();
          if (!fogRaf) fogRaf = requestAnimationFrame(reFog);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(frame);
    window.addEventListener("resize", resizeFog, { passive: true });
    resizeFog();
  }

  /* ---------- Reasons flip cards ---------- */
  function initReasons() {
    const grid = $("#reasonsGrid");
    if (!grid) return;

    CONFIG.reasons.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "reason-card reveal is-visible";
      btn.setAttribute("aria-label", `Reason ${i + 1}. Tap to flip.`);
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `
        <span class="reason-card__inner">
          <span class="reason-card__face reason-card__front">Reason #${i + 1}</span>
          <span class="reason-card__face reason-card__back">${text}</span>
        </span>`;
      btn.addEventListener("click", () => {
        const flipped = btn.classList.toggle("is-flipped");
        btn.setAttribute("aria-pressed", flipped ? "true" : "false");
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Journey map ---------- */
  function initJourney() {
    const scroller = $("#journeyScroller");
    const couple = $("#journeyCouple");
    const milestones = $$(".journey-milestone");
    if (!scroller || !couple) return;

    const positions = [50, 310, 560, 820, 1080, 1340, 1600];

    const update = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      const t = maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0;
      const x = 20 + t * 1680;
      couple.style.left = `${x}px`;

      milestones.forEach((m, i) => {
        const active = Math.abs(x - positions[i]) < 140;
        m.classList.toggle("is-active", active || t > i / (milestones.length - 1) - 0.05);
      });
    };

    scroller.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    update();

    // Auto-hint nudge once visible
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        scroller.scrollBy({ left: 40, behavior: "smooth" });
        setTimeout(() => scroller.scrollBy({ left: -40, behavior: "smooth" }), 500);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(scroller);
  }

  /* ---------- Love notes ---------- */
  function initNotes() {
    const modal = $("#noteModal");
    const textEl = $("#noteModalText");
    const closeBtn = $("#noteClose");
    if (!modal) return;

    const open = (index) => {
      textEl.textContent = CONFIG.noteMessages[index] || "";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    $$(".sticky-note").forEach((note) => {
      note.addEventListener("click", () => open(Number(note.dataset.note)));
    });

    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
  }

  /* ---------- Games ---------- */
  function initGames() {
    initGameTabs();
    initFindHeart();
    initMemoryMatch();
  }

  function initGameTabs() {
    const tabs = $$(".game-tab");
    const panels = {
      hearts: $("#gameHearts"),
      memory: $("#gameMemory"),
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        Object.entries(panels).forEach(([key, panel]) => {
          if (!panel) return;
          const on = key === tab.dataset.game;
          panel.classList.toggle("is-active", on);
          panel.hidden = !on;
          if (on) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        });
      });
    });
  }

  function initFindHeart() {
    const board = $("#findHearts");
    const result = $("#heartsResult");
    if (!board) return;

    const count = 10;
    const correct = Math.floor(Math.random() * count);
    let won = false;

    for (let i = 0; i < count; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "find-heart";
      btn.textContent = "❤️";
      btn.style.left = `${8 + Math.random() * 78}%`;
      btn.style.top = `${8 + Math.random() * 72}%`;
      btn.style.animationDelay = `${Math.random() * 2}s`;
      btn.setAttribute("aria-label", i === correct ? "Special heart" : "Heart");
      if (i === correct) btn.classList.add("is-correct");

      btn.addEventListener("click", () => {
        if (won) return;
        if (i === correct) {
          won = true;
          result.hidden = false;
          board.querySelectorAll(".find-heart").forEach((h) => {
            h.style.opacity = h === btn ? "1" : "0.25";
          });
          celebrateBurst(btn);
        } else {
          btn.style.transform = "scale(0.6)";
          btn.style.opacity = "0.3";
          setTimeout(() => {
            btn.style.transform = "";
            btn.style.opacity = "";
          }, 400);
        }
      });
      board.appendChild(btn);
    }
  }

  function celebrateBurst(el) {
    const rect = el.getBoundingClientRect();
    const layer = $("#tapHearts");
    if (!layer) return;
    for (let i = 0; i < 8; i++) {
      const s = document.createElement("span");
      s.className = "tap-heart";
      s.textContent = "✨";
      s.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px`;
      s.style.top = `${rect.top + rect.height / 2}px`;
      layer.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }

  function initMemoryMatch() {
    const board = $("#memoryBoard");
    const result = $("#memoryResult");
    if (!board) return;

    // Use pair ids so matching is reliable (emoji dataset can be flaky)
    const pairs = CONFIG.memoryIcons.map((icon, id) => ({ id, icon }));
    const deck = [...pairs, ...pairs];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    let flipped = [];
    let lock = false;
    let matched = 0;

    deck.forEach((item, idx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.pair = String(item.id);
      card.setAttribute("aria-label", `Memory card ${idx + 1}`);
      card.innerHTML = `
        <span class="memory-card__inner">
          <span class="memory-card__face memory-card__front">♡</span>
          <span class="memory-card__face memory-card__back">${item.icon}</span>
        </span>`;

      card.addEventListener("click", (e) => {
        e.preventDefault();
        if (lock || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) return;

        card.classList.add("is-flipped");
        flipped.push(card);

        if (flipped.length < 2) return;

        lock = true;
        const [a, b] = flipped;

        if (a.dataset.pair === b.dataset.pair) {
          a.classList.add("is-matched");
          b.classList.add("is-matched");
          matched += 2;
          flipped = [];
          lock = false;
          if (matched === deck.length && result) {
            result.hidden = false;
            result.removeAttribute("hidden");
          }
        } else {
          setTimeout(() => {
            a.classList.remove("is-flipped");
            b.classList.remove("is-flipped");
            flipped = [];
            lock = false;
          }, 700);
        }
      });

      board.appendChild(card);
    });
  }

  /* ---------- Love counter ---------- */
  function initCounter() {
    const days = $("#countDays");
    const hours = $("#countHours");
    const mins = $("#countMins");
    const secs = $("#countSecs");
    const meter = $("#loveMeterFill");
    if (!days) return;

    const tick = () => {
      const now = Date.now();
      const start = CONFIG.anniversaryDate.getTime();
      let diff = Math.max(0, now - start);
      const d = Math.floor(diff / 86400000);
      diff %= 86400000;
      const h = Math.floor(diff / 3600000);
      diff %= 3600000;
      const m = Math.floor(diff / 60000);
      diff %= 60000;
      const s = Math.floor(diff / 1000);

      days.textContent = d;
      hours.textContent = h;
      mins.textContent = m;
      secs.textContent = s;
    };

    tick();
    setInterval(tick, 1000);

    const meterIO = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && meter) {
          meter.style.width = "100%";
          meterIO.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (meter) meterIO.observe(meter);
  }

  /* ---------- Fun: Wheel of Us ---------- */
  function initWheel() {
    const wheel = $("#loveWheel");
    const btn = $("#wheelSpin");
    const result = $("#wheelResult");
    if (!wheel || !btn) return;

    const prizes = [
      { name: "Kiss tax", msg: "Pay up — 5 kisses. No refunds. 💋" },
      { name: "Dance break", msg: "30-second silly dance. Phone camera optional (and encouraged)." },
      { name: "Compliment storm", msg: "Say 3 over-the-top compliments. Extra points for dramatic delivery." },
      { name: "Nose boop", msg: "Boop each other’s nose. Then giggle. Mandatory." },
      { name: "Silly face-off", msg: "Ugliest face contest. Loser owes a hug." },
      { name: "Hug timer", msg: "Hug for 20 seconds without talking. Whispering counts as cheating." },
      { name: "Pet name only", msg: "Next 2 minutes: only pet names. ‘Babe’, ‘dumpling’, go wild." },
      { name: "Forever stare", msg: "Staring contest. First blink loses… and still gets a kiss." },
    ];

    let spinning = false;
    let rotation = 0;

    btn.addEventListener("click", () => {
      if (spinning) return;
      spinning = true;
      btn.disabled = true;

      const index = Math.floor(Math.random() * prizes.length);
      const slice = 360 / prizes.length;
      // Pointer is at top; slices are drawn with i*45. Land near slice center.
      const extraSpins = 4 + Math.floor(Math.random() * 3);
      const target = extraSpins * 360 + (360 - (index * slice + slice / 2));
      rotation += target;
      wheel.style.transform = `rotate(${rotation}deg)`;

      if (result) result.textContent = "Spinning the chaos…";

      setTimeout(() => {
        const prize = prizes[index];
        if (result) result.textContent = `${prize.name}: ${prize.msg}`;
        celebrateBurst(btn);
        spinning = false;
        btn.disabled = false;
      }, 4200);
    });
  }

  /* ---------- Fun: Would You Rather ---------- */
  function initRather() {
    const qEl = $("#ratherQ");
    const aBtn = $("#ratherA");
    const bBtn = $("#ratherB");
    const react = $("#ratherReact");
    const next = $("#ratherNext");
    if (!qEl || !aBtn || !bBtn) return;

    const rounds = [
      {
        q: "Would you rather…",
        a: "Never-ending road trip playlist",
        b: "Never-ending cozy rainy day indoors",
        reactA: "Vibes: main character energy. 🚗",
        reactB: "Vibes: soft blanket empire. 🌧️",
      },
      {
        q: "Would you rather…",
        a: "Cook together (and maybe burn toast)",
        b: "Order takeout like royalty",
        reactA: "Chef couple unlocked. Fire extinguisher optional.",
        reactB: "Delivery bag = love language. Valid.",
      },
      {
        q: "Would you rather…",
        a: "One giant adventure trip",
        b: "A hundred tiny date nights",
        reactA: "Passport stamps and chaos. Yes.",
        reactB: "Death by a thousand cute hangouts. Perfect.",
      },
      {
        q: "Would you rather…",
        a: "Wake up early for sunrise together",
        b: "Stay up late talking nonsense",
        reactA: "Golden hour softies. ☀️",
        reactB: "3am conspiracy theories supremacy. 🌙",
      },
      {
        q: "Would you rather…",
        a: "Match outfits forever",
        b: "Match chaos energy forever",
        reactA: "Fashion twins. People will stare.",
        reactB: "Chaos twins. People will also stare.",
      },
      {
        q: "Would you rather…",
        a: "Win a free dessert every date",
        b: "Win ‘best couple’ every room you enter",
        reactA: "Priorities: correct. 🍰",
        reactB: "Main character couple arc activated.",
      },
    ];

    let i = 0;

    const render = () => {
      const r = rounds[i % rounds.length];
      qEl.textContent = r.q;
      aBtn.textContent = r.a;
      bBtn.textContent = r.b;
      aBtn.classList.remove("is-picked");
      bBtn.classList.remove("is-picked");
      aBtn.disabled = false;
      bBtn.disabled = false;
      if (react) {
        react.hidden = true;
        react.textContent = "";
      }
      if (next) next.hidden = true;
    };

    const pick = (side) => {
      const r = rounds[i % rounds.length];
      aBtn.classList.toggle("is-picked", side === "a");
      bBtn.classList.toggle("is-picked", side === "b");
      aBtn.disabled = true;
      bBtn.disabled = true;
      if (react) {
        react.hidden = false;
        react.textContent = side === "a" ? r.reactA : r.reactB;
      }
      if (next) next.hidden = false;
    };

    aBtn.addEventListener("click", () => pick("a"));
    bBtn.addEventListener("click", () => pick("b"));
    next?.addEventListener("click", () => {
      i += 1;
      render();
    });

    render();
  }

  /* ---------- Fun: Kiss mash ---------- */
  function initKissMash() {
    const btn = $("#mashBtn");
    const fill = $("#kissJarFill");
    const countEl = $("#kissCount");
    const msg = $("#mashMsg");
    const milestones = $("#mashMilestones");
    const modal = $("#kissVideoModal");
    const video = $("#kissVideo");
    const closeBtn = $("#kissVideoClose");
    if (!btn) return;

    let count = 0;
    const goal = 50;
    let playing = false;

    const updateJar = () => {
      const pct = (count / goal) * 100;
      if (fill) fill.style.height = `${pct}%`;
      if (countEl) countEl.textContent = String(count);
    };

    const resetJar = () => {
      count = 0;
      updateJar();
      if (msg) msg.textContent = "Fill it again for another kiss 💋";
      if (milestones) milestones.textContent = "";
    };

    const hideVideo = () => {
      if (modal) {
        modal.hidden = true;
        modal.setAttribute("hidden", "");
      }
      if (closeBtn) {
        closeBtn.hidden = true;
        closeBtn.setAttribute("hidden", "");
      }
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      document.body.style.overflow = "";
      playing = false;
      resetJar();
    };

    const playKissReward = async () => {
      if (playing || !video || !modal) {
        resetJar();
        return;
      }
      playing = true;
      if (msg) msg.textContent = "JAR FULL — kiss incoming 💋✨";
      if (milestones) milestones.textContent = "Reward unlocked";

      modal.hidden = false;
      modal.removeAttribute("hidden");
      document.body.style.overflow = "hidden";

      try {
        video.currentTime = 0;
        await video.play();
      } catch {
        if (closeBtn) {
          closeBtn.hidden = false;
          closeBtn.removeAttribute("hidden");
        }
        if (msg) msg.textContent = "Tap close if the video needs a nudge.";
      }
    };

    video?.addEventListener("ended", () => {
      hideVideo();
    });

    closeBtn?.addEventListener("click", hideVideo);
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) hideVideo();
    });

    btn.addEventListener("click", () => {
      if (playing) return;
      count = Math.min(goal, count + 1);
      updateJar();

      if (count >= 5 && count < goal && msg) {
        if (count === 5) msg.textContent = "Warm-up kisses. Cute.";
        else if (count === 15) msg.textContent = "Okay you’re committed. Respect.";
        else if (count === 25) msg.textContent = "Jar’s getting jealous of your thumb.";
        else if (count === 35) msg.textContent = "Professional kiss collector energy.";
      } else if (count < 5 && msg) {
        msg.textContent = "Keep tapping — kisses incoming.";
      }

      if (count >= goal) {
        playKissReward();
      }
    });
  }

  /* ---------- Fun: Who's more likely ---------- */
  function initLikely() {
    const qEl = $("#likelyQ");
    const him = $("#likelyHim");
    const her = $("#likelyHer");
    const score = $("#likelyScore");
    const next = $("#likelyNext");
    const react = $("#likelyReact");
    const bounce = $("#bouncyHearts");
    if (!qEl || !him || !her) return;

    const rounds = [
      {
        q: "Who’s more likely to start something spicy… then get shy mid-kiss?",
        himWin: "Him wins 😭 Bro was brave for 3 seconds then blue-screened.",
        herWin: "Her wins 😏 Soft menace energy. Dangerous and adorable.",
      },
      {
        q: "Who’s more likely to moan at food louder than during… you know?",
        himWin: "Him wins. This man treats pizza like a love language.",
        herWin: "Her wins. She doesn’t eat — she performs.",
      },
      {
        q: "Who’s more likely to send a thirsty text… then panic-delete it?",
        himWin: "Him wins. Drafted in lust, deleted in fear. Iconic.",
        herWin: "Her wins. She typed danger, felt danger, ran from danger.",
      },
      {
        q: "Who’s more likely to get caught staring at the other’s body?",
        himWin: "Him wins. Sir, your eyes have no chill and no career.",
        herWin: "Her wins. She looked once and his soul left the chat.",
      },
      {
        q: "Who’s more likely to say “I’m not ticklish” and instantly betray themselves?",
        himWin: "Him wins. One poke and he’s a broken laugh track.",
        herWin: "Her wins. She lied with confidence and folded in 0.2 seconds.",
      },
      {
        q: "Who’s more likely to turn a normal hug into a full makeout session?",
        himWin: "Him wins. “Just a hug” was the biggest scam of the year.",
        herWin: "Her wins. She hugged him like WiFi: connected instantly.",
      },
      {
        q: "Who’s more likely to snort-laugh at the worst possible moment?",
        himWin: "Him wins. Emotional support pig noises unlocked.",
        herWin: "Her wins. That snort should be trademarked. I’m obsessed.",
      },
      {
        q: "Who’s more likely to get jealous over a random stranger for no reason?",
        himWin: "Him wins. Bro saw a shadow and filed a complaint.",
        herWin: "Her wins. She said “I’m chill” while mentally writing a novel.",
      },
      {
        q: "Who’s more likely to say “one more kiss” and steal twelve?",
        himWin: "Him wins. Math is fake. Kisses are infinite.",
        herWin: "Her wins. Robbery. Soft, pretty, illegal robbery.",
      },
      {
        q: "Who’s more likely to fall asleep mid-cuddle like a traitor?",
        himWin: "Him wins. Romance mode: on. Battery: 1%. Shutdown.",
        herWin: "Her wins. She cuddled him into a coma. Power move.",
      },
      {
        q: "Who’s more likely to rewatch their own cute videos and scream?",
        himWin: "Him wins. Cringe historian of their relationship.",
        herWin: "Her wins. She watched it thrice and ascended.",
      },
      {
        q: "Who’s more likely to act innocent after being extremely not innocent?",
        himWin: "Him wins. Halo on, hands dirty. Suspected.",
        herWin: "Her wins. Angel face. Demon résumé.",
      },
    ];

    let i = 0;
    let himScore = 0;
    let herScore = 0;
    let finished = false;

    if (bounce && !prefersReducedMotion()) {
      for (let n = 0; n < 6; n++) {
        const h = document.createElement("span");
        h.className = "bouncy-heart";
        h.textContent = ["💕", "✨", "🌸", "💖"][n % 4];
        h.style.left = `${10 + Math.random() * 80}%`;
        h.style.top = `${20 + Math.random() * 50}%`;
        h.style.animationDelay = `${Math.random() * 3}s`;
        bounce.appendChild(h);
      }
    }

    const showFinal = () => {
      finished = true;
      him.disabled = true;
      her.disabled = true;
      him.classList.remove("is-picked");
      her.classList.remove("is-picked");

      let verdict;
      if (herScore > himScore) {
        verdict = `FINAL VERDICT 🏆\nHer wins ${herScore}–${himScore}.\nShe’s chaotic, cute, and undefeated. Bow down.`;
      } else if (himScore > herScore) {
        verdict = `FINAL VERDICT 🏆\nHim wins ${himScore}–${herScore}.\nSomehow the soft boy survived the roast court.`;
      } else {
        verdict = `FINAL VERDICT 🤝\nTie ${herScore}–${himScore}.\nPerfectly matched chaos. Disgustingly cute.`;
      }

      qEl.textContent = "Roast complete.";
      if (react) {
        react.textContent = verdict;
        react.hidden = false;
        react.removeAttribute("hidden");
      }
      if (score) score.textContent = `Final · Him ${himScore} · Her ${herScore}`;
      if (next) {
        next.hidden = true;
        next.setAttribute("hidden", "");
      }
    };

    const render = () => {
      if (i >= rounds.length) {
        showFinal();
        return;
      }

      const round = rounds[i];
      qEl.textContent = `${round.q}`;
      if (score) score.textContent = `Q ${i + 1}/${rounds.length} · Him ${himScore} · Her ${herScore}`;
      him.classList.remove("is-picked");
      her.classList.remove("is-picked");
      him.disabled = false;
      her.disabled = false;
      if (react) {
        react.hidden = true;
        react.setAttribute("hidden", "");
        react.textContent = "";
      }
      if (next) {
        next.hidden = true;
        next.setAttribute("hidden", "");
        next.textContent = i === rounds.length - 1 ? "See the winner →" : "Next roast →";
      }
    };

    const pick = (who) => {
      if (finished || i >= rounds.length) return;
      const round = rounds[i];
      him.classList.toggle("is-picked", who === "him");
      her.classList.toggle("is-picked", who === "her");
      him.disabled = true;
      her.disabled = true;
      if (who === "him") himScore += 1;
      else herScore += 1;
      if (score) score.textContent = `Q ${i + 1}/${rounds.length} · Him ${himScore} · Her ${herScore}`;
      if (react) {
        react.textContent = who === "him" ? round.himWin : round.herWin;
        react.hidden = false;
        react.removeAttribute("hidden");
      }
      if (next) {
        next.hidden = false;
        next.removeAttribute("hidden");
        next.textContent = i === rounds.length - 1 ? "See the winner →" : "Next roast →";
      }
    };

    him.addEventListener("click", () => pick("him"));
    her.addEventListener("click", () => pick("her"));
    next?.addEventListener("click", () => {
      if (finished) return;
      i += 1;
      render();
    });

    render();
  }

  /* ---------- Digicam viewer ---------- */
  function initDigicam() {
    const photos = $$(".digicam__photo");
    const countEl = $("#digicamCount");
    const stamp = $("#digicamStamp");
    const body = $("#digicamBody");
    const prev = $("#digicamPrev");
    const next = $("#digicamNext");
    const shutter = $("#digicamShutter");
    if (!photos.length) return;

    let i = 0;

    const ensureSrc = (img) => {
      if (!img) return;
      const src = img.dataset.src;
      if (src && img.getAttribute("src") !== src) img.src = src;
    };

    const show = (index) => {
      i = (index + photos.length) % photos.length;
      ensureSrc(photos[i]);
      ensureSrc(photos[(i + 1) % photos.length]);
      photos.forEach((img, n) => img.classList.toggle("is-active", n === i));
      if (countEl) countEl.textContent = `${i + 1}/${photos.length}`;
      if (stamp) stamp.textContent = photos[i].dataset.date || "";
    };

    const flashNext = () => {
      if (body) {
        body.classList.add("is-flash");
        setTimeout(() => body.classList.remove("is-flash"), 250);
      }
      show(i + 1);
    };

    prev?.addEventListener("click", () => show(i - 1));
    next?.addEventListener("click", () => show(i + 1));
    shutter?.addEventListener("click", flashNext);
    show(0);
  }

  /* ---------- Tinder soulmate swipe ---------- */
  function initTinder() {
    const section = $("#tinder");
    const stack = $("#tinderStack");
    const status = $("#tinderStatus");
    const matchEl = $("#tinderMatch");
    const matchName = $("#tinderMatchName");
    const matchClose = $("#tinderMatchClose");
    const likeBtn = $("#tinderLike");
    const nopeBtn = $("#tinderNope");
    const actions = section?.querySelector(".td-actions");
    if (!stack) return;

    const profiles = [
      {
        name: "Boo",
        age: 24,
        tag: "Army Boo",
        bio: "Built this weapon myself. Budget: ₹50 and packing tape. I’ll protect you from thirst.",
        img: "assets/images/him/army_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Biker Boo",
        bio: "Shark helmet. Mysterious face. Cries a little every time the petrol price goes up.",
        img: "assets/images/him/biker_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Church Boo",
        bio: "Standing in front of a church so you know I’m husband material. Please swipe right before the pastor sees.",
        img: "assets/images/him/chruch_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Corporate Boo",
        bio: "Mirror selfie in formal mode. Looks employable. Will still text you memes during meetings.",
        img: "assets/images/him/coporate_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Gym Boo",
        bio: "Back day champion. Yes I have a front — unlocks on date three. Can carry all groceries in one trip.",
        img: "assets/images/him/gym_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Picnic Boo",
        bio: "Golden hour walks. All black fit. Mysterious white bag = snacks for you (mostly).",
        img: "assets/images/him/picnic_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Samurai Boo",
        bio: "Split this boulder with one chop. Looking for someone who believes me without asking questions.",
        img: "assets/images/him/samurai_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Hiking Boo",
        bio: "Will carry the snacks, the water, and the emotional baggage. Trail mix? Shared. Summit kiss? Mandatory.",
        img: "assets/images/him/hiking_boo.jpeg",
      },
      {
        name: "Boo",
        age: 24,
        tag: "Winter Boo",
        bio: "80% fur hood, 20% human. If you can find my face under here, we get married.",
        img: "assets/images/him/winter_boo.jpeg",
      },
    ];

    let index = 0;
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let hintActive = false;
    let finished = false;

    const stopHint = () => {
      hintActive = false;
      const card = stack.querySelector(".td-card:last-child");
      card?.classList.remove("is-hinting");
    };

    const playHint = () => {
      if (hintActive || finished || prefersReducedMotion() || index > 0) return;
      const card = stack.querySelector(".td-card:last-child");
      if (!card) return;
      card.classList.add("is-hinting");
      hintActive = true;
    };

    const showEndScreen = () => {
      finished = true;
      stopHint();
      stack.innerHTML = `
        <div class="td-end" role="status">
          <p class="td-end__badge">IT’S A FOREVER MATCH</p>
          <p class="td-end__title">I’m your soulmate.</p>
          <p class="td-end__line">No more profiles left.</p>
          <p class="td-end__pun">Till death do us <em>swipe</em>.</p>
          <p class="td-end__joke">The algorithm tried. Then it quit and handed you me — like a refund with abs and bad jokes.</p>
        </div>`;
      if (actions) actions.classList.add("is-done");
      if (likeBtn) likeBtn.disabled = true;
      if (nopeBtn) nopeBtn.disabled = true;
      if (status) status.textContent = "Match locked. Cancellation policy: never.";
    };

    const renderCard = () => {
      stack.innerHTML = "";
      if (index >= profiles.length) {
        showEndScreen();
        return;
      }

      const slice = profiles.slice(index, index + 2).reverse();
      slice.forEach((p, layer) => {
        const isTop = layer === slice.length - 1;
        const card = document.createElement("article");
        card.className = "td-card";
        card.style.zIndex = String(layer + 1);
        if (!isTop) card.style.transform = "scale(0.97) translateY(10px)";
        card.innerHTML = `
          <div class="td-card__bars" aria-hidden="true"><span class="is-on"></span><span></span><span></span><span></span></div>
          <span class="td-stamp td-stamp--like">LIKE</span>
          <span class="td-stamp td-stamp--nope">NOPE</span>
          <img src="${p.img}" alt="${p.tag}" width="600" height="800" draggable="false" decoding="async" loading="eager" />
          <div class="td-card__gradient" aria-hidden="true"></div>
          <div class="td-card__meta">
            <div class="td-card__row">
              <span class="td-card__name">${p.name}</span>
              <span class="td-card__age">${p.age}</span>
              <span class="td-card__verified" aria-hidden="true"><svg viewBox="0 0 24 24" fill="#fff"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z"/></svg></span>
              <span class="td-card__info" aria-hidden="true">i</span>
            </div>
            <span class="td-card__tag">✨ ${p.tag}</span>
            <p class="td-card__bio">${p.bio}</p>
          </div>`;
        if (isTop) bindCard(card, p);
        stack.appendChild(card);
      });
    };

    const showMatch = (p) => {
      if (matchName) matchName.textContent = p.tag;
      if (matchEl) {
        matchEl.hidden = false;
        matchEl.removeAttribute("hidden");
      }
    };

    const fly = (dir, profile) => {
      if (finished) return;
      stopHint();
      const card = stack.querySelector(".td-card:last-child");
      if (!card) return;
      card.style.transition = "transform 0.35s ease, opacity 0.35s";
      card.style.transform = `translateX(${dir * 480}px) rotate(${dir * 24}deg)`;
      card.style.opacity = "0";
      if (dir > 0) showMatch(profile);
      setTimeout(() => {
        index += 1;
        renderCard();
        if (status && index < profiles.length) {
          status.textContent = dir > 0 ? "Liked ✓ Keep going…" : "Passed. Next one…";
        }
      }, 320);
    };

    const bindCard = (card, profile) => {
      const onDown = (e) => {
        if (finished) return;
        stopHint();
        dragging = true;
        startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        currentX = startX;
        card.setPointerCapture?.(e.pointerId);
      };
      const onMove = (e) => {
        if (!dragging) return;
        currentX = e.clientX ?? e.touches?.[0]?.clientX ?? currentX;
        const dx = currentX - startX;
        card.style.transform = `translateX(${dx}px) rotate(${dx * 0.05}deg)`;
        card.classList.toggle("is-liking", dx > 40);
        card.classList.toggle("is-noping", dx < -40);
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        const dx = currentX - startX;
        if (dx > 90) fly(1, profile);
        else if (dx < -90) fly(-1, profile);
        else {
          card.style.transition = "transform 0.25s ease";
          card.style.transform = "";
          card.classList.remove("is-liking", "is-noping");
        }
      };

      card.addEventListener("pointerdown", onDown);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerup", onUp);
      card.addEventListener("pointercancel", onUp);
    };

    likeBtn?.addEventListener("click", () => {
      if (index < profiles.length) fly(1, profiles[index]);
    });
    nopeBtn?.addEventListener("click", () => {
      if (index < profiles.length) fly(-1, profiles[index]);
    });
    matchClose?.addEventListener("click", () => {
      if (matchEl) {
        matchEl.hidden = true;
        matchEl.setAttribute("hidden", "");
      }
    });

    if (section) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              playHint();
              io.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      io.observe(section);
    }

    renderCard();
  }

  /* ---------- Ourflix (Netflix-style) ---------- */
  function initOurflix() {
    const root = $("#ourflix");
    const profiles = $("#ourflixProfiles");
    const home = $("#ourflixHome");
    const rows = $("#ourflixRows");
    const switchBtn = $("#ourflixSwitch");
    const player = $("#ourflixPlayer");
    const video = $("#ourflixVideo");
    const playerTitle = $("#ourflixPlayerTitle");
    const playerDesc = $("#ourflixPlayerDesc");
    const closeBtn = $("#ourflixPlayerClose");
    const playHero = $("#ourflixPlayHero");
    const heroVideo = $("#ourflixHeroVideo");
    const heroTitle = $("#ourflixHeroTitle");
    const heroDesc = $("#ourflixHeroDesc");
    if (!profiles || !home || !rows) return;

    const movies = [
      {
        id: "drunk",
        title: "Your Drunk Love Story",
        desc: "Rated R for Romance & Regrettable Walking. The love was real. The straight lines were not.",
        file: "assets/images/her/your_drunk_love_story.mp4",
        poster: "assets/images/posters/your_drunk_love_story.jpg",
        tags: "Romance · Chaos · 1 Drink Minimum",
      },
      {
        id: "beauty",
        title: "Beauty and the Cripple",
        desc: "She fell first. His knees filed a complaint. A fairytale where the beast is just… chronically uncoordinated.",
        file: "assets/images/her/beauty_and_the_cripple.mp4",
        poster: "assets/images/posters/beauty_and_the_cripple.jpg",
        tags: "Fairytale · Physical Comedy · Soft Boy Arc",
      },
      {
        id: "dancer",
        title: "Dancer Move",
        desc: "When the beat drops and so does your dignity. Choreography by vibes. Rehearsals: zero.",
        file: "assets/images/her/dancer_move.mp4",
        poster: "assets/images/posters/dancer_move.jpg",
        tags: "Dance · Embarrassment · Peak Couple",
      },
      {
        id: "dinner",
        title: "Fancy Nice Dinner",
        desc: "Michelin energy. Real-person budget. They ordered like royalty and debated dessert like a UN summit.",
        file: "assets/images/her/fancy_nice_dinner.mp4",
        poster: "assets/images/posters/fancy_nice_dinner.jpg",
        tags: "Food · Flirting · Extra Napkins",
      },
      {
        id: "bike",
        title: "Fast & Furious: Bike",
        desc: "Family. Petrol. Questionable speeding. No cars were harmed — several brain cells filed for workers’ comp.",
        file: "assets/images/her/fast_and_furious_bike.mp4",
        poster: "assets/images/posters/fast_and_furious_bike.jpg",
        tags: "Action · Helmet Optional · Main Character",
      },
      {
        id: "pyraing",
        title: "Pyraing",
        desc: "Is he praying… or pyraing? Spellcheck left the chat. A spiritual thriller about hoping she texts back.",
        file: "assets/images/her/pyraing.mp4",
        poster: "assets/images/posters/pyraing.jpg",
        tags: "Drama · Typo Cinema · Divine Timing",
      },
    ];

    const catalog = [
      { row: "Continue Watching", items: [movies[0], movies[1], movies[2]] },
      { row: "Top Titles Tonight", items: [movies[3], movies[4], movies[5], movies[0]] },
    ];

    const featured = movies[0];

    const syncHero = () => {
      if (heroTitle) heroTitle.textContent = featured.title;
      if (heroDesc) heroDesc.textContent = featured.tags;
      if (playHero) playHero.setAttribute("aria-label", `Play ${featured.title}`);
      if (heroVideo) {
        heroVideo.removeAttribute("src");
        heroVideo.load();
        heroVideo.hidden = true;
      }
      const hero = $("#ourflixHero");
      let posterImg = hero?.querySelector(".nf-hero__poster");
      if (hero && !posterImg) {
        posterImg = document.createElement("img");
        posterImg.className = "nf-hero__poster";
        posterImg.alt = "";
        posterImg.decoding = "async";
        posterImg.fetchPriority = "low";
        hero.prepend(posterImg);
      }
      if (posterImg) posterImg.src = featured.poster;
    };

    const buildRows = () => {
      rows.innerHTML = "";
      catalog.forEach((group) => {
        const section = document.createElement("section");
        section.className = "nf-row";
        section.innerHTML = `<h3 class="nf-row__title">${group.row}</h3>`;
        const rail = document.createElement("div");
        rail.className = "nf-rail";
        group.items.forEach((item) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "nf-thumb";
          btn.setAttribute("aria-label", `Play ${item.title}`);
          btn.innerHTML = `
            <span class="nf-thumb__badge">N</span>
            <img class="nf-thumb__poster" src="${item.poster}" alt="" loading="lazy" decoding="async" width="240" height="360" />
            <span class="nf-thumb__title">${item.title}</span>`;
          btn.addEventListener("click", () => openPlayer(item));
          rail.appendChild(btn);
        });
        section.appendChild(rail);
        rows.appendChild(section);
      });
    };

    const openPlayer = (item) => {
      if (playerTitle) playerTitle.textContent = item.title;
      if (playerDesc) playerDesc.textContent = item.desc;
      if (video) {
        video.poster = item.poster || "";
        const source = video.querySelector("source");
        if (source) source.src = item.file;
        else video.src = item.file;
        video.load();
        video.play().catch(() => {});
      }
      if (player) {
        player.hidden = false;
        player.removeAttribute("hidden");
        document.body.style.overflow = "hidden";
      }
    };

    const closePlayer = () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      if (player) {
        player.hidden = true;
        player.setAttribute("hidden", "");
      }
      document.body.style.overflow = "";
    };

    closePlayer();
    syncHero();

    const enterHome = (profile) => {
      profiles.hidden = true;
      profiles.setAttribute("hidden", "");
      home.hidden = false;
      home.removeAttribute("hidden");
      root?.classList.add("is-browsing");
      root?.setAttribute("data-active-profile", profile || "her");
      buildRows();
    };

    const backToProfiles = () => {
      home.hidden = true;
      home.setAttribute("hidden", "");
      profiles.hidden = false;
      profiles.removeAttribute("hidden");
      root?.classList.remove("is-browsing");
      closePlayer();
    };

    $$(".nf-profile").forEach((btn) => {
      btn.addEventListener("click", () => enterHome(btn.dataset.profile));
    });
    switchBtn?.addEventListener("click", backToProfiles);
    playHero?.addEventListener("click", () => openPlayer(featured));
    closeBtn?.addEventListener("click", closePlayer);
    player?.addEventListener("click", (e) => {
      if (e.target === player) closePlayer();
    });
  }

  /* ---------- Envelope + typewriter letter ---------- */
  function initLetter() {
    const envelope = $("#envelope");
    const sheet = $("#letterSheet");
    const textEl = $("#letterText");
    if (!envelope || !sheet || !textEl) return;

    let opened = false;
    let typing = false;

    envelope.addEventListener("click", () => {
      if (opened) return;
      opened = true;
      envelope.classList.add("is-open");
      envelope.setAttribute("aria-expanded", "true");
      setTimeout(() => {
        sheet.hidden = false;
        typeWriter(textEl, CONFIG.letterText);
      }, 500);
    });

    function typeWriter(el, text) {
      if (typing || prefersReducedMotion()) {
        el.textContent = text;
        return;
      }
      typing = true;
      el.textContent = "";
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      el.appendChild(cursor);

      let i = 0;
      const step = () => {
        if (i < text.length) {
          cursor.insertAdjacentText("beforebegin", text[i]);
          i += 1;
          setTimeout(step, text[i - 1] === "\n" ? 120 : 28);
        } else {
          cursor.remove();
          typing = false;
        }
      };
      step();
    }
  }

  /* ---------- Promise swipe cards ---------- */
  function initPromises() {
    const deck = $("#promiseDeck");
    const dotsWrap = $("#promiseDots");
    if (!deck) return;

    const cards = $$(".promise-card", deck);
    let index = 0;
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    cards.forEach((c, i) => {
      c.style.zIndex = String(cards.length - i);
      if (i === 0) c.classList.add("is-active");
    });

    if (dotsWrap) {
      cards.forEach((_, i) => {
        const d = document.createElement("span");
        if (i === 0) d.classList.add("is-active");
        dotsWrap.appendChild(d);
      });
    }

    const updateDots = () => {
      $$("span", dotsWrap).forEach((d, i) => d.classList.toggle("is-active", i === index));
    };

    const showCard = (i) => {
      cards.forEach((c, j) => {
        c.classList.toggle("is-active", j === i);
        c.style.zIndex = String(cards.length - Math.abs(j - i));
        if (j < i) {
          c.style.opacity = "0";
          c.style.pointerEvents = "none";
        } else {
          c.style.opacity = j === i ? "1" : String(0.7 - (j - i) * 0.1);
          c.style.pointerEvents = j === i ? "auto" : "none";
          c.style.transform = j === i ? "" : `scale(${1 - (j - i) * 0.04}) translateY(${(j - i) * 8}px)`;
        }
      });
      updateDots();
    };

    const advance = (dir) => {
      const card = cards[index];
      if (!card) return;
      card.classList.add(dir < 0 ? "is-leaving-left" : "is-leaving-right");
      setTimeout(() => {
        index = (index + 1) % cards.length;
        cards.forEach((c) => {
          c.classList.remove("is-leaving-left", "is-leaving-right");
          c.style.transform = "";
          c.style.opacity = "";
          c.style.pointerEvents = "";
        });
        // Restack
        const order = [...cards.slice(index), ...cards.slice(0, index)];
        order.forEach((c, i) => {
          c.style.zIndex = String(cards.length - i);
          c.classList.toggle("is-active", i === 0);
          if (i > 0) {
            c.style.transform = `scale(${1 - i * 0.04}) translateY(${i * 8}px)`;
            c.style.opacity = String(0.7 - i * 0.1);
            c.style.pointerEvents = "none";
          }
        });
        updateDots();
      }, 320);
    };

    deck.addEventListener(
      "pointerdown",
      (e) => {
        dragging = true;
        startX = e.clientX;
        currentX = startX;
        deck.setPointerCapture?.(e.pointerId);
      },
      { passive: true }
    );

    deck.addEventListener(
      "pointermove",
      (e) => {
        if (!dragging) return;
        currentX = e.clientX;
        const dx = currentX - startX;
        const active = cards.find((c) => c.classList.contains("is-active")) || cards[index];
        if (active) {
          active.style.transform = `translateX(${dx}px) rotate(${dx * 0.04}deg)`;
        }
      },
      { passive: true }
    );

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      const dx = currentX - startX;
      const active = cards.find((c) => c.classList.contains("is-active")) || cards[index];
      if (Math.abs(dx) > 70) {
        advance(dx);
      } else if (active) {
        active.style.transform = "";
      }
    };

    deck.addEventListener("pointerup", endDrag);
    deck.addEventListener("pointercancel", endDrag);

    showCard(0);
  }

  /* ---------- Butterflies ---------- */
  function initButterflies() {
    const wrap = $("#butterflies");
    if (!wrap || prefersReducedMotion()) return;
    for (let i = 0; i < 5; i++) {
      const b = document.createElement("span");
      b.className = "butterfly";
      b.textContent = "🦋";
      b.style.left = `${10 + Math.random() * 80}%`;
      b.style.top = `${15 + Math.random() * 60}%`;
      b.style.animationDelay = `${Math.random() * 5}s`;
      b.style.animationDuration = `${6 + Math.random() * 5}s`;
      wrap.appendChild(b);
    }
  }

  /* ---------- Scratch card ---------- */
  function initScratch() {
    const canvas = $("#scratchCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || 320;
    const cssH = canvas.clientHeight || 180;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Cover layer
    const grad = ctx.createLinearGradient(0, 0, cssW, cssH);
    grad.addColorStop(0, "#d4af6a");
    grad.addColorStop(0.5, "#e8c4b0");
    grad.addColorStop(1, "#c45c7a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cssW, cssH);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "600 18px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch here ✨", cssW / 2, cssH / 2);

    let scratching = false;
    let revealed = false;

    const scratchAt = (x, y) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      return {
        x: ((point.clientX - rect.left) / rect.width) * cssW,
        y: ((point.clientY - rect.top) / rect.height) * cssH,
      };
    };

    const checkReveal = () => {
      if (revealed) return;
      const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      // Sample every 32nd pixel for performance
      for (let i = 3; i < sample.length; i += 32 * 4) {
        if (sample[i] < 128) clear += 1;
      }
      const total = sample.length / (32 * 4);
      if (clear / total > 0.45) {
        revealed = true;
        ctx.clearRect(0, 0, cssW, cssH);
        canvas.style.pointerEvents = "none";
        canvas.style.opacity = "0";
        canvas.style.transition = "opacity 0.5s";
      }
    };

    const start = (e) => {
      scratching = true;
      const p = getPos(e);
      scratchAt(p.x, p.y);
      e.preventDefault();
    };
    const move = (e) => {
      if (!scratching) return;
      const p = getPos(e);
      scratchAt(p.x, p.y);
      checkReveal();
      e.preventDefault();
    };
    const end = () => {
      scratching = false;
      checkReveal();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
  }

  /* ---------- Finale fireworks / confetti / petals ---------- */
  function initFinale() {
    const section = $("#finale");
    const canvas = $("#finaleCanvas");
    if (!section || !canvas) return;

    const lines = $$("[data-finale]", section);
    let started = false;
    let raf = 0;
    let particles = [];
    let fireworks = [];

    const ctx = canvas.getContext("2d");
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const spawnConfetti = () => {
      for (let i = 0; i < 4; i++) {
        particles.push({
          type: "confetti",
          x: Math.random() * canvas.clientWidth,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: 1 + Math.random() * 2.5,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.1,
          w: 4 + Math.random() * 5,
          h: 6 + Math.random() * 6,
          color: ["#f7c6d8", "#d4af6a", "#d4c4e8", "#fff", "#e89bb5"][Math.floor(Math.random() * 5)],
          life: 1,
        });
      }
    };

    const spawnPetal = () => {
      particles.push({
        type: "petal",
        x: Math.random() * canvas.clientWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 0.8 + Math.random() * 1.5,
        rot: Math.random() * Math.PI,
        vr: 0.02,
        life: 1,
      });
    };

    const boom = () => {
      const x = 40 + Math.random() * (canvas.clientWidth - 80);
      const y = 60 + Math.random() * (canvas.clientHeight * 0.45);
      const colors = ["#f7c6d8", "#d4af6a", "#fff", "#e89bb5", "#d4c4e8"];
      for (let i = 0; i < 36; i++) {
        const angle = (Math.PI * 2 * i) / 36;
        const speed = 1.5 + Math.random() * 2.5;
        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: colors[i % colors.length],
        });
      }
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (Math.random() > 0.6) spawnConfetti();
      if (Math.random() > 0.85) spawnPetal();
      if (Math.random() > 0.97) boom();

      particles = particles.filter((p) => p.y < h + 20 && p.life > 0);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.type === "confetti") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.fillStyle = "rgba(247,198,216,0.75)";
          ctx.beginPath();
          ctx.ellipse(0, 0, 5, 8, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      fireworks = fireworks.filter((f) => f.life > 0);
      fireworks.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.03;
        f.life -= 0.016;
        ctx.globalAlpha = Math.max(0, f.life);
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(draw);
    };

    const runSequence = () => {
      if (started) return;
      started = true;

      lines.forEach((el) => {
        const step = Number(el.dataset.finale) || 1;
        setTimeout(() => el.classList.add("is-shown"), step * 1200);
      });

      if (!prefersReducedMotion()) {
        draw();
        setTimeout(() => boom(), 1500);
        setTimeout(() => boom(), 2800);
        setTimeout(() => boom(), 4200);
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.45) {
          runSequence();
        }
      },
      { threshold: [0.45, 0.6] }
    );
    io.observe(section);
  }

  /* ---------- Boot ---------- */
  onReady(() => {
    initSiteLock();
    initLoader();
    initScrollProgress();
    initStarsCanvas();
    initOpeningPetals();
    initMusicPlayer();
    initTapEffects();
    initFloatingMessages();
    initReveals();
    initTimeline();
    initGallery();
    initSpicy();
    initReasons();
    initJourney();
    initNotes();
    initGames();
    initKissMash();
    initLikely();
    initDigicam();
    initTinder();
    initOurflix();
    initCounter();
    initLetter();
    initPromises();
    initButterflies();
    initScratch();
    initFinale();
  });
})();
