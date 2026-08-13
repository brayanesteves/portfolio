/* ==========================================================================
   ANIMUS 1.28 CLI INTERACTIVE CONSOLE
   Provides command line access to genetic memory data.
   ========================================================================== */

(function () {
  const consoleModal = document.getElementById('console-modal');
  const consoleBody = document.getElementById('console-body');
  const consoleInput = document.getElementById('console-input');
  const closeConsoleBtn = document.getElementById('close-console-btn');
  const openConsoleBtns = document.querySelectorAll('.open-console-trigger');

  if (!consoleModal || !consoleInput) return;

  function toggleConsole() {
    const isOpening = !consoleModal.classList.contains('active');
    consoleModal.classList.toggle('active');
    if (isOpening) {
      consoleInput.focus();
      if (window.AnimusAudio) AnimusAudio.playSyncPulse();
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

  // Hotkey ~ or Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      toggleConsole();
    } else if (e.key === 'Escape' && consoleModal.classList.contains('active')) {
      toggleConsole();
    }
  });

  function printLine(text, className = '') {
    const p = document.createElement('p');
    p.className = `console-line ${className}`;
    p.innerHTML = text;
    consoleBody.appendChild(p);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    const args = cmd.split(' ');
    const primary = args[0];

    printLine(`<span style="color: var(--animus-cyan)">SUBJECT@ANIMUS:~$</span> ${cmdRaw}`);

    if (window.AnimusAudio) AnimusAudio.playClick();

    switch (primary) {
      case 'help':
        printLine('==================================================', 'text-muted');
        printLine('ANIMUS 1.28 COMMAND PROTOCOLS:');
        printLine('  <span style="color: var(--animus-cyan)">bio</span> / <span style="color: var(--animus-cyan)">subject</span>  - Muestra el resumen profesional del sujeto');
        printLine('  <span style="color: var(--animus-cyan)">skills</span> [query]  - Consulta la matriz de habilidades técnicas');
        printLine('  <span style="color: var(--animus-cyan)">exp</span>             - Lista la secuencia de experiencias laborales');
        printLine('  <span style="color: var(--animus-cyan)">projects</span>        - Muestra los nodos arquitectónicos principales');
        printLine('  <span style="color: var(--animus-cyan)">contact</span>         - Datos de transmisión y canales de comunicación');
        printLine('  <span style="color: var(--animus-cyan)">theme</span>           - Alterna entre Animus White y Abstergo Dark');
        printLine('  <span style="color: var(--animus-cyan)">sync</span>            - Ejecuta re-sincronización de memoria');
        printLine('  <span style="color: var(--animus-cyan)">clear</span>           - Limpia la consola');
        printLine('==================================================', 'text-muted');
        break;

      case 'bio':
      case 'subject':
        printLine('<strong>SUJETO: BRAYAN ESTEVES</strong>');
        printLine('ROL: Arquitecto de Software | Especialista Backend & Sistemas Distribuidos');
        printLine('UBICACIÓN: Caracas, Venezuela');
        printLine('EXPERIENCIA: +11 años Java/Backend, GCP/AWS, Clojure, Kafka, Solidity, .NET, Python, Node.js');
        break;

      case 'skills':
        printLine('<strong>HABILIDADES CLAVE:</strong>');
        printLine('- Backend: Java (Spring Boot, Quarkus), Clojure, Python (FastAPI, Django), .NET, Ruby, Solidity');
        printLine('- Arquitectura: Event-Driven (Kafka 100+ tópicos), RxJava, Microservicios, Hexagonal');
        printLine('- Cloud & DevOps: GCP (GKE, Cloud SQL), AWS (Bedrock, Connect), Docker, Kubernetes, CI/CD');
        printLine('- Bases de Datos: PostgreSQL, MongoDB, gRQL Graph Database');
        break;

      case 'exp':
        printLine('<strong>SECUENCIAS DE MEMORIA (EXPERIENCIA):</strong>');
        printLine('1. 2025: Monetae.io - Desarrollador Web3 & Smart Contracts');
        printLine('2. 2024-Pres: gRQL - Director de Tecnología Interino (CTO)');
        printLine('3. 2025: Dinocloud - FullStack Senior AWS Solutions (Bedrock Multi-agent)');
        printLine('4. 2024-2025: Moveapps - Arquitecto de Software & Líder Técnico');
        printLine('5. 2021-2025: Halcón Bit - CEO & Fundador Agencia Digital');
        break;

      case 'contact':
        printLine('<strong>CANALES DE TRANSMISIÓN:</strong>');
        printLine('- Teléfono/WhatsApp: +584149904852');
        printLine('- Email: brayan.esteves93@gmail.com');
        printLine('- LinkedIn: linkedin.com/in/brayanesteves93');
        printLine('- GitHub: github.com/brayanesteves');
        break;

      case 'theme':
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('animus_theme', newTheme);
        printLine(`TEMA CAMBIADO A: ${newTheme.toUpperCase()}`);
        break;

      case 'sync':
        printLine('Sincronizando fragmentos de memoria genéticos...', 'animus-pulse');
        if (window.AnimusAudio) AnimusAudio.playSyncPulse();
        break;

      case 'clear':
        consoleBody.innerHTML = '';
        printLine('ANIMUS 1.28 CONSOLE [SYSTEM ONLINE]. Escribe <span style="color: var(--animus-cyan)">help</span> para ver los comandos disponibles.');
        break;

      default:
        if (cmd !== '') {
          printLine(`Comando no reconocido: '${cmd}'. Escribe <span style="color: var(--animus-cyan)">help</span> para asistencia.`, 'text-muted');
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
})();
