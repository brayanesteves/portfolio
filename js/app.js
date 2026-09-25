/* ==========================================================================
   ANIMUS 2.0 APPLICATION ENGINE
   Handles boot loading, scroll animations, audio, skill tabs and metrics.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. BOOT SEQUENCE ANIMATION
  // --------------------------------------------------------------------------
  const bootScreen = document.getElementById('boot-screen');
  const bootLogs = document.getElementById('boot-logs');
  const bootFill = document.getElementById('boot-progress-fill');
  const bootSyncVal = document.getElementById('boot-sync-val');

  const bootMessages = [
    "[SYS_INIT] Initializing Animus Intelligence System 2.0...",
    "[IDENTITY_SCAN] Authenticating subject profile Brayan_Esteves...",
    "[MEMORY_BLOCK_01] Software Architecture & Distributed Systems loaded.",
    "[MEMORY_BLOCK_02] Indexing Java, Clojure, Kafka, Web3 & Cloud stack...",
    "[SYSTEM_ONLINE] Neural links active. Ready."
  ];

  let logIdx = 0;
  let progress = 0;

  function runBootSequence() {
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress > 100) progress = 100;

      if (bootFill) bootFill.style.width = `${progress}%`;
      if (bootSyncVal) bootSyncVal.textContent = `${progress}%`;

      if (logIdx < bootMessages.length && Math.random() > 0.2) {
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
            setTimeout(() => bootScreen.style.display = 'none', 700);
          }
          if (window.AnimusAudio) window.AnimusAudio.playSyncPulse();
          animateMetrics();
          initScrollReveals();
        }, 400);
      }
    }, 150);
  }

  runBootSequence();

  // --------------------------------------------------------------------------
  // 2. AUDIO & MOBILE MENU CONTROLS
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sysNav = document.querySelector('.sys-nav');

  if (mobileMenuBtn && sysNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = sysNav.classList.toggle('mobile-active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
      if (window.AnimusAudio) window.AnimusAudio.playClick();
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.sys-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        sysNav.classList.remove('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  const audioBtn = document.getElementById('audio-toggle-btn');
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
      ? '<span>[🔇 AUDIO OFF]</span>' 
      : '<span>[🔊 AUDIO ON]</span>';
  }

  // Attach subtle audio triggers on hover/click
  document.querySelectorAll('a, button, .dark-card, .tab-btn, .contact-node').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.AnimusAudio) window.AnimusAudio.playHover();
    });
    el.addEventListener('click', () => {
      if (window.AnimusAudio) window.AnimusAudio.playClick();
    });
  });

  // --------------------------------------------------------------------------
  // 3. NEURAL SKILL MATRIX TAB FILTERING & SEARCH
  // --------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const nodeCards = document.querySelectorAll('.node-card');
  const searchInput = document.getElementById('skills-search');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      filterSkills(cat, searchInput ? searchInput.value : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeCat = document.querySelector('.tab-btn.active')?.getAttribute('data-category') || 'all';
      filterSkills(activeCat, e.target.value);
    });
  }

  function filterSkills(category, query) {
    const q = query.toLowerCase().trim();

    nodeCards.forEach(card => {
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
  // 4. SYSTEM METRICS COUNTER ANIMATION
  // --------------------------------------------------------------------------
  function animateMetrics() {
    document.querySelectorAll('.metric-num-val').forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      let count = 0;
      const step = Math.max(1, Math.floor(target / 25));
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        el.textContent = count;
      }, 40);
    });
  }

  // --------------------------------------------------------------------------
  // 5. INTERSECTION OBSERVER FOR SCROLL REVEALS
  // --------------------------------------------------------------------------
  function initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Active section link highlighter on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

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
