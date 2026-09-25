/* ==========================================================================
   ANIMUS 2.0 CANVAS BACKGROUND ENGINE
   Renders subtle constellation nodes, faint dark grid streams, and parallax.
   ========================================================================== */

(function () {
  const canvas = document.getElementById('animus-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let nodes = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNodes();
  }

  class ConstellationNode {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.5 + 1;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx + (mouse.x * 0.02);
      this.y += this.vy + (mouse.y * 0.02);

      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha * 0.6})`;
      ctx.fill();
    }
  }

  function initNodes() {
    nodes = [];
    const count = Math.floor((width * height) / 25000);
    for (let i = 0; i < count; i++) {
      nodes.push(new ConstellationNode());
    }
  }

  function drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse damping
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    drawConnections();

    nodes.forEach(node => {
      node.update();
      node.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.2;
    mouse.targetY = (e.clientY - height / 2) * 0.2;
  });

  window.addEventListener('resize', resize);

  resize();
  animate();
})();
