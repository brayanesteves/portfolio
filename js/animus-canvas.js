/* ==========================================================================
   ANIMUS 1.28 CANVAS BACKGROUND ENGINE
   Renders 3D polygon memory shards, glowing grid streams and nodes.
   ========================================================================== */

(function () {
  const canvas = document.getElementById('animus-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let shards = [];
  let particles = [];
  let nodes = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initElements();
  }

  // Memory Shard Object (Triangles & Polygons)
  class Shard {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 3 + 0.5; // depth
      this.size = Math.random() * 25 + 10;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.01;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.35 + 0.1;
    }

    update() {
      this.x += this.vx + (mouse.x * 0.05 / this.z);
      this.y += this.vy + (mouse.y * 0.05 / this.z);
      this.rotation += this.rotSpeed;

      if (this.x < -50) this.x = width + 50;
      if (this.x > width + 50) this.x = -50;
      if (this.y < -50) this.y = height + 50;
      if (this.y > height + 50) this.y = -50;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(1 / this.z, 1 / this.z);

      ctx.beginPath();
      // Draw 3D-like memory fragment shard (triangle)
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size * 0.8, this.size * 0.6);
      ctx.lineTo(-this.size * 0.8, this.size * 0.6);
      ctx.closePath();

      const isDark = document.body.getAttribute('data-theme') === 'dark';
      const strokeColor = isDark ? `rgba(0, 240, 255, ${this.alpha * 1.2})` : `rgba(0, 180, 230, ${this.alpha})`;
      const fillColor = isDark ? `rgba(0, 240, 255, ${this.alpha * 0.15})` : `rgba(255, 255, 255, ${this.alpha * 0.8})`;

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }

  // Floating Neural Node Object
  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 210, 255, 0.6)';
      ctx.fill();
    }
  }

  function initElements() {
    shards = [];
    nodes = [];
    const shardCount = Math.floor(width / 50);
    const nodeCount = Math.floor(width / 30);

    for (let i = 0; i < shardCount; i++) {
      shards.push(new Shard());
    }

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
  }

  function drawConnections() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const lineAlpha = isDark ? 0.12 : 0.08;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${(1 - dist / 120) * lineAlpha})`;
          ctx.lineWidth = 0.8;
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

    shards.forEach(shard => {
      shard.update();
      shard.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.5;
    mouse.targetY = (e.clientY - height / 2) * 0.5;
  });

  window.addEventListener('resize', resize);

  resize();
  animate();
})();
