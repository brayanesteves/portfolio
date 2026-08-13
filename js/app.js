/* ==========================================================================
   ANIMUS 1.28 APPLICATION CORE LOGIC
   Handles UI interactions, Boot Sequence, Filtering, Modals & Audio HUD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // AUDIO & THEME CONTROLS INITIALIZATION
  // --------------------------------------------------------------------------
  const audioBtn = document.getElementById('audio-toggle-btn');
  const themeBtn = document.getElementById('theme-toggle-btn');

  // Restore Theme preference
  const savedTheme = localStorage.getItem('animus_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // --------------------------------------------------------------------------
  // 1. BOOT SEQUENCE ANIMATION
  // --------------------------------------------------------------------------
  const bootScreen = document.getElementById('boot-screen');
  const bootLogs = document.getElementById('boot-logs');
  const bootFill = document.getElementById('boot-progress-fill');
  const bootSyncVal = document.getElementById('boot-sync-val');

  const bootMessages = [
    "[SYS_INIT] Connecting to Animus Core 1.28...",
    "[DNA_SCAN] Extracting subject sequence Brayan_Esteves...",
    "[MEMORY_BLOCK_01] Reading Software Architecture & Distributed Systems...",
    "[MEMORY_BLOCK_02] Indexing Java, Clojure, Kafka, Web3 & Cloud stack...",
    "[SYNCHRONIZING] Memory stability: 100% OK."
  ];

  let logIdx = 0;
  let progress = 0;

  function runBootSequence() {
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 12;
      if (progress > 100) progress = 100;

      if (bootFill) bootFill.style.width = `${progress}%`;
      if (bootSyncVal) bootSyncVal.textContent = `${progress}%`;

      if (logIdx < bootMessages.length && Math.random() > 0.3) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = bootMessages[logIdx];
        if (bootLogs) {
          bootLogs.appendChild(line);
          bootLogs.scrollTop = bootLogs.scrollHeight;
        }
        logIdx++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (bootScreen) {
            bootScreen.classList.add('fade-out');
            setTimeout(() => bootScreen.style.display = 'none', 800);
          }
          if (window.AnimusAudio) window.AnimusAudio.playSyncPulse();
          animateMetrics();
        }, 500);
      }
    }, 180);
  }

  runBootSequence();

  // --------------------------------------------------------------------------
  // 2. AUDIO & THEME CONTROLS BINDINGS
  // --------------------------------------------------------------------------
  if (audioBtn) {
    updateAudioBtn();
    audioBtn.addEventListener('click', () => {
      const muted = window.AnimusAudio.toggleMute();
      updateAudioBtn();
      if (!muted) window.AnimusAudio.playClick();
    });
  }

  function updateAudioBtn() {
    if (!audioBtn || !window.AnimusAudio) return;
    const isMuted = window.AnimusAudio.getMuteState();
    audioBtn.innerHTML = isMuted 
      ? '<span>[🔇 MUTED]</span>' 
      : '<span>[🔊 AUDIO ON]</span>';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('animus_theme', next);
      updateThemeIcon(next);
      if (window.AnimusAudio) window.AnimusAudio.playClick();
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === 'dark' 
      ? '<span>[🌙 ABSTERGO DARK]</span>' 
      : '<span>[☀️ ANIMUS WHITE]</span>';
  }

  // Attach audio hover/click listeners to interactive elements
  document.querySelectorAll('a, button, .hud-panel, .filter-btn, .exp-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.AnimusAudio) window.AnimusAudio.playHover();
    });
    el.addEventListener('click', () => {
      if (window.AnimusAudio) window.AnimusAudio.playClick();
    });
  });

  // --------------------------------------------------------------------------
  // 3. SKILLS MATRIX FILTER & SEARCH
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const searchInput = document.getElementById('skills-search');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      filterSkills(cat, searchInput ? searchInput.value : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeCat = document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all';
      filterSkills(activeCat, e.target.value);
    });
  }

  function filterSkills(category, query) {
    const q = query.toLowerCase().trim();

    skillCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCat = (category === 'all' || cardCat === category);
      const matchesSearch = (q === '' || cardText.includes(q));

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. METRICS ANIMATION
  // --------------------------------------------------------------------------
  function animateMetrics() {
    document.querySelectorAll('.metric-val').forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      let count = 0;
      const step = Math.max(1, Math.floor(target / 25));
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = `${count}${suffix}`;
      }, 40);
    });
  }

  // Active section link highlighter on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 150;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
