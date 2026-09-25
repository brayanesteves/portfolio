/* ==========================================================================
   ANIMUS 2.0 CLI CONSOLE & MULTIVERSE ACTION ENGINE
   ========================================================================== */

(function () {
  const consoleModal = document.getElementById('console-modal');
  const consoleWindow = document.querySelector('.console-window');
  const consoleBody = document.getElementById('console-body');
  const consoleInput = document.getElementById('console-input');
  const closeConsoleBtn = document.getElementById('close-console-btn');
  const openConsoleBtns = document.querySelectorAll('.open-console-trigger');
  
  const megaWrap = document.getElementById('megaman-arcade-wrap');
  const closeMegaBtn = document.getElementById('close-megaman-btn');
  const megaCanvas = document.getElementById('megaman-canvas');

  if (!consoleModal || !consoleInput) return;

  let isGameActive = false;
  let gameLoopId = null;

  // --------------------------------------------------------------------------
  // 1. CONSOLE OPEN / CLOSE & LOADING ANIMATION
  // --------------------------------------------------------------------------
  function toggleConsole() {
    const isOpening = !consoleModal.classList.contains('active');
    
    if (isOpening) {
      consoleModal.classList.add('active');
      if (consoleWindow) consoleWindow.classList.add('loading');
      
      if (window.AnimusAudio) AnimusAudio.playSyncPulse();

      // Simulated CLI link establishing loading sequence
      setTimeout(() => {
        if (consoleWindow) consoleWindow.classList.remove('loading');
        consoleInput.focus();
      }, 600);
    } else {
      consoleModal.classList.remove('active');
      if (isGameActive) stopEasterEggGame();
    }
  }

  openConsoleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleConsole();
    });
  });

  if (closeConsoleBtn) {
    closeConsoleBtn.addEventListener('click', toggleConsole);
  }

  // Hotkeys ~ and Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      toggleConsole();
    } else if (e.key === 'Escape') {
      if (isGameActive) {
        stopEasterEggGame();
      } else if (consoleModal.classList.contains('active')) {
        toggleConsole();
      }
    }
  });

  function printLine(text, className = '') {
    const p = document.createElement('p');
    p.className = `console-line ${className}`;
    p.innerHTML = text;
    consoleBody.appendChild(p);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  // --------------------------------------------------------------------------
  // 2. COMMAND HANDLER
  // --------------------------------------------------------------------------
  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    const primary = cmd.split(' ')[0];

    printLine(`<span style="color: var(--cyan-energy)">SUBJECT@ANIMUS:~$</span> ${cmdRaw}`);

    if (window.AnimusAudio) AnimusAudio.playClick();

    switch (primary) {
      case 'help':
        printLine('==================================================', 'text-muted');
        printLine('ANIMUS 2.0 SYSTEM COMMAND PROTOCOLS:');
        printLine('  <span style="color: var(--cyan-energy)">bio</span> / <span style="color: var(--cyan-energy)">subject</span>  - Displays professional architect summary');
        printLine('  <span style="color: var(--cyan-energy)">skills</span> [query]  - Queries technical skill matrix');
        printLine('  <span style="color: var(--cyan-energy)">exp</span>             - Lists career memory sequence');
        printLine('  <span style="color: var(--cyan-energy)">projects</span>        - Shows architectural node highlights');
        printLine('  <span style="color: var(--cyan-energy)">contact</span>         - Transmission channels & contact info');
        printLine('  <span style="color: var(--cyan-energy)">megaman</span> / <span style="color: var(--cyan-energy)">assassin</span> / <span style="color: var(--cyan-energy)">batman</span> / <span style="color: var(--cyan-energy)">transformers</span> / <span style="color: var(--cyan-energy)">pacificrim</span> / <span style="color: var(--cyan-energy)">crossover</span> - [GAME] Easter Eggs');
        printLine('  <span style="color: var(--cyan-energy)">sync</span>            - Triggers memory re-sync sequence');
        printLine('  <span style="color: var(--cyan-energy)">clear</span>           - Clears terminal output');
        printLine('==================================================', 'text-muted');
        break;

      case 'bio':
      case 'subject':
        printLine('<strong>SUBJECT: BRAYAN ESTEVES</strong>');
        printLine('ROLE: Software Architect | Backend & Distributed Systems Specialist');
        printLine('LOCATION: Caracas, Venezuela');
        printLine('EXPERIENCE: 11+ years Java/Backend, GCP/AWS, Clojure, Kafka, Solidity, .NET, Python, Node.js');
        break;

      case 'skills':
        printLine('<strong>NEURAL SKILL MATRIX:</strong>');
        printLine('- Backend: Java (Spring Boot, Quarkus), Clojure, Python (FastAPI, Django), .NET, Ruby, Solidity');
        printLine('- Architecture: Event-Driven (Kafka 100+ topics), RxJava, Microservices, Hexagonal');
        printLine('- Cloud & DevOps: GCP (GKE, Cloud SQL), AWS (Bedrock, Connect), Docker, Kubernetes, CI/CD');
        printLine('- Databases: PostgreSQL, MongoDB, gRQL Graph Database Engine');
        break;

      case 'exp':
        printLine('<strong>MEMORY SEQUENCE (EXPERIENCE):</strong>');
        printLine('1. 2025: Monetae.io - Web3 Developer & Smart Contracts');
        printLine('2. 2024-Pres: gRQL Engine - Interim Chief Technology Officer (CTO)');
        printLine('3. 2025: Dinocloud - Senior FullStack AWS Solutions (Bedrock Multi-Agent)');
        printLine('4. 2024-2025: Moveapps - Software Architect & Tech Lead (Toyota Chile)');
        printLine('5. 2021-2025: HalcÃ³n Bit / Fenrirsoft - CEO, Founder & CTO');
        break;

      case 'contact':
        printLine('<strong>TRANSMISSION CHANNELS:</strong>');
        printLine('- WhatsApp: +584149904852');
        printLine('- Email: brayan.esteves93@gmail.com');
        printLine('- LinkedIn: linkedin.com/in/brayanesteves93');
        printLine('- GitHub: github.com/brayanesteves');
        break;

      case 'megaman':
      case 'mega':
      case 'game':
        printLine('[GAME] <span style="color: #00f0ff">LAUNCHING MEGA MAN PROTOCOL... GET EQUIPPED!</span>');
        startEasterEggGame('megaman');
        break;

      case 'assassin':
      case 'assassinscreed':
        printLine('ðŸ¦… <span style="color: #fff">SYNCHRONIZING MEMORY: ASSASSIN... REQUIESCAT IN PACE.</span>');
        startEasterEggGame('assassin');
        break;

      case 'batman':
        printLine('ðŸ¦‡ <span style="color: #f59e0b">BATCOMPUTER UPLINK ESTABLISHED... I AM VENGEANCE.</span>');
        startEasterEggGame('batman');
        break;
      
      case 'transformers':
        printLine('ðŸ¤– <span style="color: #ef4444">AUTOBOTS, ROLL OUT!</span>');
        startEasterEggGame('transformers');
        break;
      
      case 'pacificrim':
        printLine('ðŸŒŠ <span style="color: #00f0ff">JAEGER NEURAL HANDSHAKE INITIATED... DRIFT COMPATIBLE.</span>');
        startEasterEggGame('pacificrim');
        break;
      
      case 'crossover':
        printLine('[!] <span style="color: #ff00ff">WARNING: MULTIVERSE ANOMALY DETECTED. INITIATING ULTIMATE CROSSOVER!</span>');
        startEasterEggGame('crossover');
        break;

      case 'sync':
        printLine('Synchronizing memory fragments...', 'animus-pulse');
        if (window.AnimusAudio) AnimusAudio.playSyncPulse();
        break;

      case 'clear':
        consoleBody.innerHTML = '';
        printLine('ANIMUS 2.0 CONSOLE [SYSTEM ONLINE]. Type <span style="color: var(--cyan-energy)">help</span> for protocols.');
        break;

      default:
        if (cmd !== '') {
          printLine(`Unrecognized command: '${cmd}'. Type <span style="color: var(--cyan-energy)">help</span> or <span style="color: var(--cyan-energy)">megaman</span>.`, 'text-muted');
        }
        break;
    }
  }

  consoleInput.addEventListener('keydown', (e) => {
    if (window.AnimusAudio) AnimusAudio.playTyping();
    if (e.key === 'Enter') {
      const val = consoleInput.value;
      consoleInput.value = '';
      handleCommand(val);
    }
  });

  if (closeMegaBtn) {
    closeMegaBtn.addEventListener('click', stopEasterEggGame);
  }

  // --------------------------------------------------------------------------
  // 3. TOP-DOWN ADVENTURE ENGINE (MULTIVERSE)
  // --------------------------------------------------------------------------
  let ctx = megaCanvas ? megaCanvas.getContext('2d') : null;
  let player, entities, walls, zones, particles;
  let currentTheme = 'megaman';
  let keys = {};
  let camera = {x: 0, y: 0};
  let score = 0;
  let gamePhase = 'play'; // play, over, win

  const WORLD_W = 1200;
  const WORLD_H = 800;

  function startEasterEggGame(theme) {
    if (!megaCanvas || !ctx) return;
    currentTheme = theme || 'megaman';
    isGameActive = true;
    megaWrap.style.display = 'flex';
    gamePhase = 'play';
    score = 0;
    
    // Reset inputs
    keys = {};
    window.addEventListener('keydown', hdDown);
    window.addEventListener('keyup', hdUp);

    buildWorld(currentTheme);
    
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    runGameLoop();
  }

  function stopEasterEggGame() {
    isGameActive = false;
    if (megaWrap) megaWrap.style.display = 'none';
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    window.removeEventListener('keydown', hdDown);
    window.removeEventListener('keyup', hdUp);
    printLine('ðŸŽ® Protocol closed.', 'text-muted');
  }

  function rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.w || r2.x + r2.w < r1.x || r2.y > r1.y + r1.h || r2.y + r2.h < r1.y);
  }

  function hdDown(e) { if(isGameActive) { keys[e.key] = true; if(e.key===' ') e.preventDefault(); } }
  function hdUp(e) { if(isGameActive) keys[e.key] = false; }

  function buildWorld(t) {
    entities = [];
    walls = [];
    zones = []; 
    particles = [];

    // Player default
    player = {
       x: WORLD_W/2, y: WORLD_H/2, w: 20, h: 20,
       vx: 0, vy: 0, speed: 4,
       hp: 10, maxHp: 10,
       color: '#00f0ff',
       facing: 'right', state: 'normal',
       attackCooldown: 0, dashTimer: 0
    };

    // Border walls
    walls.push({x:0, y:0, w:WORLD_W, h:10});
    walls.push({x:0, y:WORLD_H-10, w:WORLD_W, h:10});
    walls.push({x:0, y:0, w:10, h:WORLD_H});
    walls.push({x:WORLD_W-10, y:0, w:10, h:WORLD_H});

    // Theme specifics
    if (t === 'transformers') {
       player.color = '#ef4444'; // Optimus
       player.speed = 4;
       // add some city block walls
       walls.push({x: 200, y: 200, w: 100, h: 100});
       walls.push({x: 800, y: 500, w: 200, h: 50});
       spawnEnemies(10, 'decepticon');
    } else if (t === 'assassin') {
       player.color = '#ffffff';
       player.speed = 3;
       // Add stealth bushes (zones)
       zones.push({x: 300, y: 300, w: 150, h: 150, type: 'bush', color: '#14532d'});
       zones.push({x: 700, y: 150, w: 100, h: 200, type: 'bush', color: '#14532d'});
       spawnEnemies(8, 'templar');
    } else if (t === 'batman') {
       player.color = '#1f2937';
       player.speed = 4;
       spawnEnemies(15, 'thug');
    } else if (t === 'pacificrim') {
       player.color = '#3b82f6';
       player.speed = 2; // slow heavy
       player.w = 40; player.h = 40;
       player.hp = 30; player.maxHp = 30;
       spawnEnemies(3, 'kaiju'); // few big enemies
    } else {
       // crossover / megaman
       player.color = '#00f0ff';
       spawnEnemies(12, 'met');
    }
  }

  function spawnEnemies(count, type) {
     for(let i=0; i<count; i++) {
        entities.push({
           type: 'enemy', eType: type,
           x: Math.random() * (WORLD_W-100) + 50,
           y: Math.random() * (WORLD_H-100) + 50,
           w: (type==='kaiju')? 60 : 20,
           h: (type==='kaiju')? 60 : 20,
           hp: (type==='kaiju')? 20 : (type==='templar'? 3 : 2),
           speed: (type==='kaiju')? 1 : (Math.random()*1 + 1),
           color: (type==='decepticon')? '#9333ea' : (type==='templar')? '#dc2626' : (type==='thug')? '#22c55e' : (type==='kaiju')? '#10b981' : '#f59e0b',
           state: 'patrol'
        });
     }
  }

  function runGameLoop() {
    if (!isGameActive) return;

    if (gamePhase === 'play') {
       // Player movement
       let dx = 0, dy = 0;
       if (keys['ArrowUp'] || keys['w'] || keys['W']) dy -= 1;
       if (keys['ArrowDown'] || keys['s'] || keys['S']) dy += 1;
       if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx -= 1;
       if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 1;

       // Normalize
       let len = Math.sqrt(dx*dx + dy*dy);
       if (len > 0) { dx /= len; dy /= len; }

       // Transformations / States
       let curSpeed = player.speed;
       if (currentTheme === 'transformers' && keys['Shift']) {
          player.state = 'car';
          curSpeed = 10;
          player.color = '#3b82f6'; // car color
       } else {
          player.state = 'normal';
          if(currentTheme === 'transformers') player.color = '#ef4444';
       }

       let nextX = player.x + dx * curSpeed;
       let nextY = player.y + dy * curSpeed;

       // Wall collisions
       let pRect = {x: nextX, y: nextY, w: player.w, h: player.h};
       let hitWall = false;
       for(let w of walls) {
          if (rectIntersect(pRect, w)) { hitWall = true; break; }
       }
       if (!hitWall) { player.x = nextX; player.y = nextY; }
       
       if (dx > 0) player.facing = 'right';
       if (dx < 0) player.facing = 'left';
       if (dy > 0) player.facing = 'down';
       if (dy < 0) player.facing = 'up';

       // Stealth mechanic
       let inBush = false;
       if (currentTheme === 'assassin') {
          for(let z of zones) {
             if (z.type === 'bush' && rectIntersect(player, z)) inBush = true;
          }
          player.state = inBush ? 'stealth' : 'normal';
       }

       // Attack Mechanics
       if (player.attackCooldown > 0) player.attackCooldown--;
       if (keys[' '] && player.attackCooldown <= 0) {
          player.attackCooldown = (currentTheme === 'pacificrim') ? 40 : 15;
          let atkRect = {x: player.x, y: player.y, w: 20, h: 20};
          let range = (currentTheme === 'batman') ? 100 : (currentTheme === 'pacificrim') ? 50 : 30;
          if (currentTheme === 'transformers') range = 150; // Shoot
          
          if(player.facing === 'right') { atkRect.w = range; atkRect.x += player.w; }
          if(player.facing === 'left') { atkRect.w = range; atkRect.x -= range; }
          if(player.facing === 'down') { atkRect.h = range; atkRect.y += player.h; }
          if(player.facing === 'up') { atkRect.h = range; atkRect.y -= range; }

          // Add attack particle
          particles.push({x: atkRect.x, y: atkRect.y, w: atkRect.w, h: atkRect.h, life: 10, color: '#fff'});
          
          // Check hits
          for(let e of entities) {
             if (e.type === 'enemy' && rectIntersect(atkRect, e)) {
                let dmg = (currentTheme === 'pacificrim') ? 10 : (inBush ? 10 : 1); // assassination does 10
                e.hp -= dmg;
                e.state = 'alert';
             }
          }
          if (window.AnimusAudio) window.AnimusAudio.playClick();
       }

       // Car collision (Transformers)
       if (player.state === 'car') {
          for(let e of entities) {
             if (e.type === 'enemy' && rectIntersect(player, e)) {
                e.hp -= 5;
             }
          }
       }

       // Entity Logic
       for (let i = entities.length - 1; i >= 0; i--) {
          let e = entities[i];
          if (e.hp <= 0) {
             score += 100;
             entities.splice(i, 1);
             continue;
          }

          // AI
          let dist = Math.hypot(player.x - e.x, player.y - e.y);
          if (dist < 300 && player.state !== 'stealth') {
             e.state = 'alert';
          } else {
             e.state = 'patrol';
          }

          if (e.state === 'alert') {
             let ex = (player.x - e.x) / dist;
             let ey = (player.y - e.y) / dist;
             let nx = e.x + ex * e.speed;
             let ny = e.y + ey * e.speed;
             
             // Move if no wall
             let eRect = {x: nx, y: ny, w: e.w, h: e.h};
             let ewHit = false;
             for(let w of walls) if(rectIntersect(eRect, w)) ewHit = true;
             if(!ewHit) { e.x = nx; e.y = ny; }

             // Attack player
             if (dist < e.w + 10 && player.dashTimer <= 0) {
                player.hp -= (e.eType === 'kaiju') ? 5 : 1;
                player.dashTimer = 30; // invuln
             }
          }
       }
       
       if (player.dashTimer > 0) player.dashTimer--;
       if (player.hp <= 0) gamePhase = 'over';
       if (entities.length === 0) gamePhase = 'win';

       // Camera follow
       camera.x = player.x - megaCanvas.width / 2;
       camera.y = player.y - megaCanvas.height / 2;
       camera.x = Math.max(0, Math.min(camera.x, WORLD_W - megaCanvas.width));
       camera.y = Math.max(0, Math.min(camera.y, WORLD_H - megaCanvas.height));
    }

    // DRAW
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, megaCanvas.width, megaCanvas.height);
    
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Draw Grid / Ground
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for(let i=0; i<WORLD_W; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,WORLD_H); ctx.stroke(); }
    for(let i=0; i<WORLD_H; i+=50) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(WORLD_W,i); ctx.stroke(); }

    // Draw Zones
    for(let z of zones) {
       ctx.fillStyle = z.color;
       ctx.globalAlpha = 0.5;
       ctx.fillRect(z.x, z.y, z.w, z.h);
       ctx.globalAlpha = 1.0;
    }

    // Draw Walls
    ctx.fillStyle = '#333';
    for(let w of walls) ctx.fillRect(w.x, w.y, w.w, w.h);

    // Draw Particles
    for (let i = particles.length - 1; i >= 0; i--) {
       let p = particles[i];
       ctx.fillStyle = p.color;
       ctx.fillRect(p.x, p.y, p.w, p.h);
       p.life--;
       if(p.life <= 0) particles.splice(i, 1);
    }

    // Draw Enemies
    for(let e of entities) {
       ctx.fillStyle = e.color;
       ctx.fillRect(e.x, e.y, e.w, e.h);
       // HP bar
       ctx.fillStyle = '#f00';
       ctx.fillRect(e.x, e.y - 8, e.w * (e.hp / (e.eType==='kaiju'?20:3)), 4);
    }

    // Draw Player
    if (player.dashTimer % 4 < 2) {
       ctx.fillStyle = player.color;
       if (player.state === 'stealth') ctx.globalAlpha = 0.4;
       if (player.state === 'car') {
          ctx.fillRect(player.x, player.y, player.w*1.5, player.h*0.8);
       } else {
          ctx.fillRect(player.x, player.y, player.w, player.h);
       }
       ctx.globalAlpha = 1.0;
    }

    ctx.restore();

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText(`PROTOCOL: ${currentTheme.toUpperCase()} | SCORE: ${score} | ENEMIES: ${entities.length}`, 15, 25);
    ctx.fillStyle = '#f00';
    ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, 15, 45);
    
    if (currentTheme === 'transformers') ctx.fillText(`[SHIFT] = Transform into Car`, 15, 65);
    if (currentTheme === 'assassin') ctx.fillText(`Hide in green zones for stealth!`, 15, 65);

    if (gamePhase === 'over') {
       ctx.fillStyle = 'rgba(0,0,0,0.8)';
       ctx.fillRect(0,0,megaCanvas.width, megaCanvas.height);
       ctx.fillStyle = '#f00';
       ctx.font = '24px "JetBrains Mono", monospace';
       ctx.fillText('MISSION FAILED', megaCanvas.width/2 - 90, 120);
    }
    if (gamePhase === 'win') {
       ctx.fillStyle = 'rgba(0,0,0,0.8)';
       ctx.fillRect(0,0,megaCanvas.width, megaCanvas.height);
       ctx.fillStyle = '#0f0';
       ctx.font = '24px "JetBrains Mono", monospace';
       ctx.fillText('MISSION COMPLETE!', megaCanvas.width/2 - 100, 120);
    }

    gameLoopId = requestAnimationFrame(runGameLoop);
  }
})();
