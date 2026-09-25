/**
 * @file animus-console.js
 * @description TerminalUI & MultiverseEngine Classes. Handles the CLI Modal and the 2D Top-Down Game Engine.
 */

class MultiverseEngine {
  constructor(canvasId, wrapperId, closeBtnId) {
    this.canvas = document.getElementById(canvasId);
    this.wrapper = document.getElementById(wrapperId);
    this.closeBtn = document.getElementById(closeBtnId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.isGameActive = false;
    this.gameLoopId = null;
    this.currentTheme = 'megaman';
    this.keys = {};
    this.camera = { x: 0, y: 0 };
    this.score = 0;
    this.gamePhase = 'play'; // play, over, win

    this.WORLD_W = 1200;
    this.WORLD_H = 800;

    this.player = null;
    this.entities = [];
    this.walls = [];
    this.zones = [];
    this.particles = [];
    this.bullets = [];

    this.bindStaticEvents();
  }

  bindStaticEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.stop());
    }
  }

  start(theme) {
    if (!this.canvas || !this.ctx || !this.wrapper) return;
    this.currentTheme = theme || 'megaman';
    this.isGameActive = true;
    this.wrapper.style.display = 'flex';
    this.gamePhase = 'play';
    this.score = 0;
    this.keys = {};

    this.hdDown = (e) => { if(this.isGameActive) { this.keys[e.key] = true; if(e.key===' ') e.preventDefault(); } };
    this.hdUp = (e) => { if(this.isGameActive) this.keys[e.key] = false; };

    window.addEventListener('keydown', this.hdDown);
    window.addEventListener('keyup', this.hdUp);

    this.buildWorld();
    
    if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    this.loop();
  }

  stop() {
    this.isGameActive = false;
    if (this.wrapper) this.wrapper.style.display = 'none';
    if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    window.removeEventListener('keydown', this.hdDown);
    window.removeEventListener('keyup', this.hdUp);
    
    // Notify terminal
    if (window.TerminalInstance) {
       window.TerminalInstance.printLine('🎮 Protocol closed.', 'text-muted');
    }
  }

  rectIntersect(r1, r2) {
    let w1 = r1.w || r1.width || 0;
    let h1 = r1.h || r1.height || 0;
    let w2 = r2.w || r2.width || 0;
    let h2 = r2.h || r2.height || 0;
    return !(r2.x > r1.x + w1 || r2.x + w2 < r1.x || r2.y > r1.y + h1 || r2.y + h2 < r1.y);
  }

  buildWorld() {
    this.entities = [];
    this.walls = [];
    this.zones = [];
    this.particles = [];
    this.bullets = [];

    this.player = {
       x: this.WORLD_W/2, y: this.WORLD_H/2, w: 20, h: 20,
       vx: 0, vy: 0, speed: 4,
       hp: 10, maxHp: 10,
       color: '#00f0ff',
       facing: 'right', state: 'normal',
       attackCooldown: 0, dashTimer: 0
    };

    // Border walls
    this.walls.push({x:0, y:0, w:this.WORLD_W, h:10});
    this.walls.push({x:0, y:this.WORLD_H-10, w:this.WORLD_W, h:10});
    this.walls.push({x:0, y:0, w:10, h:this.WORLD_H});
    this.walls.push({x:this.WORLD_W-10, y:0, w:10, h:this.WORLD_H});

    // Theme specifics
    if (this.currentTheme === 'transformers') {
       this.player.color = '#ef4444';
       this.player.speed = 4;
       this.walls.push({x: 200, y: 200, w: 100, h: 100});
       this.walls.push({x: 800, y: 500, w: 200, h: 50});
       this.spawnEnemies(10, 'decepticon');
    } else if (this.currentTheme === 'assassin') {
       this.player.color = '#ffffff';
       this.player.speed = 3;
       this.zones.push({x: 300, y: 300, w: 150, h: 150, type: 'bush', color: '#14532d'});
       this.zones.push({x: 700, y: 150, w: 100, h: 200, type: 'bush', color: '#14532d'});
       this.spawnEnemies(8, 'templar');
    } else if (this.currentTheme === 'batman') {
       this.player.color = '#1f2937';
       this.player.speed = 4;
       this.spawnEnemies(15, 'thug');
    } else if (this.currentTheme === 'pacificrim') {
       this.player.color = '#3b82f6';
       this.player.speed = 2; 
       this.player.w = 40; this.player.h = 40;
       this.player.hp = 30; this.player.maxHp = 30;
       this.spawnEnemies(3, 'kaiju'); 
    } else {
       this.player.color = '#00f0ff';
       this.spawnEnemies(12, 'met');
    }
  }

  spawnEnemies(count, type) {
     for(let i=0; i<count; i++) {
        this.entities.push({
           type: 'enemy', eType: type,
           x: Math.random() * (this.WORLD_W-100) + 50,
           y: Math.random() * (this.WORLD_H-100) + 50,
           w: (type==='kaiju')? 60 : 20,
           h: (type==='kaiju')? 60 : 20,
           hp: (type==='kaiju')? 20 : (type==='templar'? 3 : 2),
           speed: (type==='kaiju')? 1 : (Math.random()*1 + 1),
           color: (type==='decepticon')? '#9333ea' : (type==='templar')? '#dc2626' : (type==='thug')? '#22c55e' : (type==='kaiju')? '#10b981' : '#f59e0b',
           state: 'patrol'
        });
     }
  }

  loop() {
    if (!this.isGameActive) return;

    if (this.gamePhase === 'play') {
       this.updatePlayState();
    }

    this.draw();
    this.gameLoopId = requestAnimationFrame(() => this.loop());
  }

  updatePlayState() {
     let dx = 0, dy = 0;
     if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy -= 1;
     if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy += 1;
     if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx -= 1;
     if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx += 1;

     let len = Math.sqrt(dx*dx + dy*dy);
     if (len > 0) { dx /= len; dy /= len; }

     let curSpeed = this.player.speed;
     if (this.currentTheme === 'transformers' && this.keys['Shift']) {
        this.player.state = 'car';
        curSpeed = 10;
        this.player.color = '#3b82f6';
     } else {
        this.player.state = 'normal';
        if(this.currentTheme === 'transformers') this.player.color = '#ef4444';
     }

     let nextX = this.player.x + dx * curSpeed;
     let nextY = this.player.y + dy * curSpeed;

     let pRect = {x: nextX, y: nextY, w: this.player.w, h: this.player.h};
     let hitWall = false;
     for(let w of this.walls) {
        if (this.rectIntersect(pRect, w)) { hitWall = true; break; }
     }
     if (!hitWall) { this.player.x = nextX; this.player.y = nextY; }
     
     if (dx > 0) this.player.facing = 'right';
     if (dx < 0) this.player.facing = 'left';
     if (dy > 0) this.player.facing = 'down';
     if (dy < 0) this.player.facing = 'up';

     let inBush = false;
     if (this.currentTheme === 'assassin') {
        for(let z of this.zones) {
           if (z.type === 'bush' && this.rectIntersect(this.player, z)) inBush = true;
        }
        this.player.state = inBush ? 'stealth' : 'normal';
     }

     if (this.player.attackCooldown > 0) this.player.attackCooldown--;
     if (this.keys[' '] && this.player.attackCooldown <= 0) {
        this.player.attackCooldown = (this.currentTheme === 'pacificrim') ? 40 : 15;
        let atkRect = {x: this.player.x, y: this.player.y, w: 20, h: 20};
        let range = (this.currentTheme === 'batman') ? 100 : (this.currentTheme === 'pacificrim') ? 50 : 30;
        if (this.currentTheme === 'transformers') range = 150;
        
        if(this.player.facing === 'right') { atkRect.w = range; atkRect.x += this.player.w; }
        if(this.player.facing === 'left') { atkRect.w = range; atkRect.x -= range; }
        if(this.player.facing === 'down') { atkRect.h = range; atkRect.y += this.player.h; }
        if(this.player.facing === 'up') { atkRect.h = range; atkRect.y -= range; }

        this.particles.push({x: atkRect.x, y: atkRect.y, w: atkRect.w, h: atkRect.h, life: 10, color: '#fff'});
        
        for(let e of this.entities) {
           if (e.type === 'enemy' && this.rectIntersect(atkRect, e)) {
              let dmg = (this.currentTheme === 'pacificrim') ? 10 : (inBush ? 10 : 1);
              e.hp -= dmg;
              e.state = 'alert';
           }
        }
        if (window.AnimusAudio) window.AnimusAudio.playClick();
     }

     if (this.player.state === 'car') {
        for(let e of this.entities) {
           if (e.type === 'enemy' && this.rectIntersect(this.player, e)) {
              e.hp -= 5;
           }
        }
     }

     for (let i = this.entities.length - 1; i >= 0; i--) {
        let e = this.entities[i];
        if (e.hp <= 0) {
           this.score += 100;
           this.entities.splice(i, 1);
           continue;
        }

        let dist = Math.hypot(this.player.x - e.x, this.player.y - e.y);
        if (dist < 300 && this.player.state !== 'stealth') {
           e.state = 'alert';
        } else {
           e.state = 'patrol';
        }

        if (e.state === 'alert') {
           let ex = (this.player.x - e.x) / dist;
           let ey = (this.player.y - e.y) / dist;
           let nx = e.x + ex * e.speed;
           let ny = e.y + ey * e.speed;
           
           let eRect = {x: nx, y: ny, w: e.w, h: e.h};
           let ewHit = false;
           for(let w of this.walls) if(this.rectIntersect(eRect, w)) ewHit = true;
           if(!ewHit) { e.x = nx; e.y = ny; }

           if (dist < e.w + 10 && this.player.dashTimer <= 0) {
              this.player.hp -= (e.eType === 'kaiju') ? 5 : 1;
              this.player.dashTimer = 30;
           }
        }
     }
     
     if (this.player.dashTimer > 0) this.player.dashTimer--;
     if (this.player.hp <= 0) this.gamePhase = 'over';
     if (this.entities.length === 0) this.gamePhase = 'win';

     this.camera.x = this.player.x - this.canvas.width / 2;
     this.camera.y = this.player.y - this.canvas.height / 2;
     this.camera.x = Math.max(0, Math.min(this.camera.x, this.WORLD_W - this.canvas.width));
     this.camera.y = Math.max(0, Math.min(this.camera.y, this.WORLD_H - this.canvas.height));
  }

  draw() {
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    this.ctx.strokeStyle = '#1a1a1a';
    this.ctx.lineWidth = 1;
    for(let i=0; i<this.WORLD_W; i+=50) { this.ctx.beginPath(); this.ctx.moveTo(i,0); this.ctx.lineTo(i,this.WORLD_H); this.ctx.stroke(); }
    for(let i=0; i<this.WORLD_H; i+=50) { this.ctx.beginPath(); this.ctx.moveTo(0,i); this.ctx.lineTo(this.WORLD_W,i); this.ctx.stroke(); }

    for(let z of this.zones) {
       this.ctx.fillStyle = z.color;
       this.ctx.globalAlpha = 0.5;
       this.ctx.fillRect(z.x, z.y, z.w, z.h);
       this.ctx.globalAlpha = 1.0;
    }

    this.ctx.fillStyle = '#333';
    for(let w of this.walls) this.ctx.fillRect(w.x, w.y, w.w, w.h);

    for (let i = this.particles.length - 1; i >= 0; i--) {
       let p = this.particles[i];
       this.ctx.fillStyle = p.color;
       this.ctx.fillRect(p.x, p.y, p.w, p.h);
       p.life--;
       if(p.life <= 0) this.particles.splice(i, 1);
    }

    for(let e of this.entities) {
       this.ctx.fillStyle = e.color;
       this.ctx.fillRect(e.x, e.y, e.w, e.h);
       this.ctx.fillStyle = '#f00';
       this.ctx.fillRect(e.x, e.y - 8, e.w * (e.hp / (e.eType==='kaiju'?20:3)), 4);
    }

    if (this.player.dashTimer % 4 < 2) {
       this.ctx.fillStyle = this.player.color;
       if (this.player.state === 'stealth') this.ctx.globalAlpha = 0.4;
       if (this.player.state === 'car') {
          this.ctx.fillRect(this.player.x, this.player.y, this.player.w*1.5, this.player.h*0.8);
       } else {
          this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
       }
       this.ctx.globalAlpha = 1.0;
    }

    this.ctx.restore();

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px "JetBrains Mono", monospace';
    this.ctx.fillText(`PROTOCOL: ${this.currentTheme.toUpperCase()} | SCORE: ${this.score} | ENEMIES: ${this.entities.length}`, 15, 25);
    this.ctx.fillStyle = '#f00';
    this.ctx.fillText(`HP: ${this.player.hp}/${this.player.maxHp}`, 15, 45);
    
    if (this.currentTheme === 'transformers') this.ctx.fillText(`[SHIFT] = Transform into Car`, 15, 65);
    if (this.currentTheme === 'assassin') this.ctx.fillText(`Hide in green zones for stealth!`, 15, 65);

    if (this.gamePhase === 'over') {
       this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
       this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
       this.ctx.fillStyle = '#f00';
       this.ctx.font = '24px "JetBrains Mono", monospace';
       this.ctx.fillText('MISSION FAILED', this.canvas.width/2 - 90, 120);
    }
    if (this.gamePhase === 'win') {
       this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
       this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
       this.ctx.fillStyle = '#0f0';
       this.ctx.font = '24px "JetBrains Mono", monospace';
       this.ctx.fillText('MISSION COMPLETE!', this.canvas.width/2 - 100, 120);
    }
  }
}

class TerminalUI {
  constructor(engineInstance) {
    this.modal = document.getElementById('console-modal');
    this.window = document.querySelector('.console-window');
    this.body = document.getElementById('console-body');
    this.input = document.getElementById('console-input');
    this.closeBtn = document.getElementById('close-console-btn');
    this.openBtns = document.querySelectorAll('.open-console-trigger');
    
    this.engine = engineInstance;

    if (this.modal && this.input) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.toggle());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape') {
        if (this.engine.isGameActive) {
          this.engine.stop();
        } else if (this.modal.classList.contains('active')) {
          this.toggle();
        }
      }
    });

    this.input.addEventListener('keydown', (e) => {
      if (window.AnimusAudio) window.AnimusAudio.playTyping();
      if (e.key === 'Enter') {
        const val = this.input.value;
        this.input.value = '';
        this.handleCommand(val);
      }
    });
  }

  toggle() {
    const isOpening = !this.modal.classList.contains('active');
    if (isOpening) {
      this.modal.classList.add('active');
      if (this.window) this.window.classList.add('loading');
      if (window.AnimusAudio) window.AnimusAudio.playSyncPulse();
      
      setTimeout(() => {
        if (this.window) this.window.classList.remove('loading');
        this.input.focus();
      }, 600);
    } else {
      this.modal.classList.remove('active');
      if (this.engine.isGameActive) this.engine.stop();
    }
  }

  printLine(text, className = '') {
    const p = document.createElement('p');
    p.className = `console-line ${className}`;
    p.innerHTML = text;
    this.body.appendChild(p);
    this.body.scrollTop = this.body.scrollHeight;
  }

  handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    const primary = cmd.split(' ')[0];

    this.printLine(`<span style="color: var(--cyan-energy)">SUBJECT@ANIMUS:~$</span> ${cmdRaw}`);
    if (window.AnimusAudio) window.AnimusAudio.playClick();

    switch (primary) {
      case 'help':
        this.printLine('==================================================', 'text-muted');
        this.printLine('ANIMUS 2.0 SYSTEM COMMAND PROTOCOLS:');
        this.printLine('  <span style="color: var(--cyan-energy)">bio</span> / <span style="color: var(--cyan-energy)">subject</span>  - Displays professional architect summary');
        this.printLine('  <span style="color: var(--cyan-energy)">skills</span> [query]  - Queries technical skill matrix');
        this.printLine('  <span style="color: var(--cyan-energy)">exp</span>             - Lists career memory sequence');
        this.printLine('  <span style="color: var(--cyan-energy)">projects</span>        - Shows architectural node highlights');
        this.printLine('  <span style="color: var(--cyan-energy)">contact</span>         - Transmission channels & contact info');
        this.printLine('  <span style="color: var(--cyan-energy)">megaman</span> / <span style="color: var(--cyan-energy)">assassin</span> / <span style="color: var(--cyan-energy)">batman</span> / <span style="color: var(--cyan-energy)">transformers</span> / <span style="color: var(--cyan-energy)">pacificrim</span> / <span style="color: var(--cyan-energy)">crossover</span> - 🎮 Easter Eggs');
        this.printLine('  <span style="color: var(--cyan-energy)">sync</span>            - Triggers memory re-sync sequence');
        this.printLine('  <span style="color: var(--cyan-energy)">clear</span>           - Clears terminal output');
        this.printLine('==================================================', 'text-muted');
        break;

      case 'bio':
      case 'subject':
        this.printLine('<strong>SUBJECT: BRAYAN ESTEVES</strong>');
        this.printLine('ROLE: Software Architect | Backend & Distributed Systems Specialist');
        this.printLine('LOCATION: Caracas, Venezuela');
        this.printLine('EXPERIENCE: 11+ years Java/Backend, GCP/AWS, Clojure, Kafka, Solidity, .NET, Python, Node.js');
        break;

      case 'skills':
        this.printLine('<strong>NEURAL SKILL MATRIX:</strong>');
        this.printLine('- Backend: Java (Spring Boot, Quarkus), Clojure, Python (FastAPI, Django), .NET, Ruby, Solidity');
        this.printLine('- Architecture: Event-Driven (Kafka 100+ topics), RxJava, Microservices, Hexagonal');
        this.printLine('- Cloud & DevOps: GCP (GKE, Cloud SQL), AWS (Bedrock, Connect), Docker, Kubernetes, CI/CD');
        this.printLine('- Databases: PostgreSQL, MongoDB, gRQL Graph Database Engine');
        break;

      case 'exp':
        this.printLine('<strong>MEMORY SEQUENCE (EXPERIENCE):</strong>');
        this.printLine('1. 2025: Monetae.io - Web3 Developer & Smart Contracts');
        this.printLine('2. 2024-Pres: gRQL Engine - Interim Chief Technology Officer (CTO)');
        this.printLine('3. 2025: Dinocloud - Senior FullStack AWS Solutions (Bedrock Multi-Agent)');
        this.printLine('4. 2024-2025: Moveapps - Software Architect & Tech Lead (Toyota Chile)');
        this.printLine('5. 2021-2025: Halcón Bit / Fenrirsoft - CEO, Founder & CTO');
        break;

      case 'contact':
        this.printLine('<strong>TRANSMISSION CHANNELS:</strong>');
        this.printLine('- WhatsApp: +584149904852');
        this.printLine('- Email: brayan.esteves93@gmail.com');
        this.printLine('- LinkedIn: linkedin.com/in/brayanesteves93');
        this.printLine('- GitHub: github.com/brayanesteves');
        break;

      case 'megaman':
      case 'mega':
      case 'game':
      case 'assassin':
      case 'assassinscreed':
      case 'batman':
      case 'transformers':
      case 'pacificrim':
      case 'crossover':
        this.printLine(`🚀 <span style="color: #00f0ff">LAUNCHING ${primary.toUpperCase()} PROTOCOL...</span>`);
        this.engine.start(primary === 'assassinscreed' ? 'assassin' : primary);
        break;

      case 'sync':
        this.printLine('Synchronizing memory fragments...', 'animus-pulse');
        if (window.AnimusAudio) window.AnimusAudio.playSyncPulse();
        break;

      case 'clear':
        this.body.innerHTML = '';
        this.printLine('ANIMUS 2.0 CONSOLE [SYSTEM ONLINE]. Type <span style="color: var(--cyan-energy)">help</span> for protocols.');
        break;

      default:
        if (cmd !== '') {
          this.printLine(`Unrecognized command: '${cmd}'. Type <span style="color: var(--cyan-energy)">help</span>.`, 'text-muted');
        }
        break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new MultiverseEngine('megaman-canvas', 'megaman-arcade-wrap', 'close-megaman-btn');
  const terminal = new TerminalUI(engine);
  // Export facade for global access
  window.TerminalInstance = terminal;
});
