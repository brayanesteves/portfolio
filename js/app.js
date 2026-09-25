/**
 * @file app.js
 * @description PortfolioApp Bootstrapper Class. Connects subsystems and handles global UI logic.
 */

class PortfolioApp {
  constructor() {
    this.bootScreen = document.getElementById('boot-screen');
    this.bootLogs = document.getElementById('boot-logs');
    this.bootFill = document.getElementById('boot-progress-fill');
    this.bootSyncVal = document.getElementById('boot-sync-val');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.sysNav = document.querySelector('.sys-nav');
    this.audioBtn = document.getElementById('audio-toggle-btn');
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.nodeCards = document.querySelectorAll('.node-card');
    this.searchInput = document.getElementById('skills-search');
    
    this.bootMessages = [
      "[SYS_INIT] Initializing Animus Intelligence System 2.0...",
      "[IDENTITY_SCAN] Authenticating subject profile Brayan_Esteves...",
      "[MEMORY_BLOCK_01] Software Architecture & Distributed Systems loaded.",
      "[MEMORY_BLOCK_02] Indexing Java, Clojure, Kafka, Web3 & Cloud stack...",
      "[SYSTEM_ONLINE] Neural links active. Ready."
    ];
  }

  init() {
    this.runBootSequence();
    this.bindEvents();
    this.bindScrollObservers();
    this.updateAudioBtn();
  }

  runBootSequence() {
    let logIdx = 0;
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress > 100) progress = 100;

      if (this.bootFill) this.bootFill.style.width = `${progress}%`;
      if (this.bootSyncVal) this.bootSyncVal.textContent = `${progress}%`;

      if (logIdx < this.bootMessages.length && Math.random() > 0.2) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.textContent = this.bootMessages[logIdx];
        if (this.bootLogs) {
          this.bootLogs.appendChild(line);
          this.bootLogs.scrollTop = this.bootLogs.scrollHeight;
        }
        logIdx++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (this.bootScreen) {
            this.bootScreen.classList.add('fade-out');
            setTimeout(() => this.bootScreen.style.display = 'none', 700);
          }
          if (window.AnimusAudio) window.AnimusAudio.playSyncPulse();
          this.animateMetrics();
        }, 400);
      }
    }, 150);
  }

  bindEvents() {
    // Mobile Menu
    if (this.mobileMenuBtn && this.sysNav) {
      this.mobileMenuBtn.addEventListener('click', () => {
        const isActive = this.sysNav.classList.toggle('mobile-active');
        const icon = this.mobileMenuBtn.querySelector('i');
        if (icon) icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        if (window.AnimusAudio) window.AnimusAudio.playClick();
      });

      document.querySelectorAll('.sys-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
          this.sysNav.classList.remove('mobile-active');
          const icon = this.mobileMenuBtn.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        });
      });
    }

    // Audio Toggle
    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', () => {
        if (!window.AnimusAudio) return;
        const muted = window.AnimusAudio.toggleMute();
        this.updateAudioBtn();
        if (!muted) window.AnimusAudio.playClick();
      });
    }

    // Global Interaction Sounds
    document.querySelectorAll('a, button, .dark-card, .tab-btn, .contact-node').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.AnimusAudio) window.AnimusAudio.playHover();
      });
      el.addEventListener('click', () => {
        if (window.AnimusAudio) window.AnimusAudio.playClick();
      });
    });

    // Skill Tabs Filtering
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        this.filterSkills(cat, this.searchInput ? this.searchInput.value : '');
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        const activeCat = document.querySelector('.tab-btn.active')?.getAttribute('data-category') || 'all';
        this.filterSkills(activeCat, e.target.value);
      });
    }
  }

  updateAudioBtn() {
    if (!this.audioBtn || !window.AnimusAudio) return;
    const isMuted = window.AnimusAudio.getMuteState();
    this.audioBtn.innerHTML = isMuted 
      ? '<span>[🔇 AUDIO OFF]</span>' 
      : '<span>[🔉 AUDIO ON]</span>';
  }

  filterSkills(category, query) {
    const q = query.toLowerCase().trim();
    this.nodeCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();
      const matchesCat = (category === 'all' || cardCat === category);
      const matchesSearch = (q === '' || cardText.includes(q));
      card.style.display = (matchesCat && matchesSearch) ? 'flex' : 'none';
    });
  }

  animateMetrics() {
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

  bindScrollObservers() {
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
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();
});
