/**
 * @file animus-canvas.js
 * @description BackgroundMeshRenderer Class. Renders the interactive sci-fi constellation background.
 */

class BackgroundMeshRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.nodes = [];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.resize();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  handleMouseMove(e) {
    this.mouse.targetX = (e.clientX - this.width / 2) * 0.2;
    this.mouse.targetY = (e.clientY - this.height / 2) * 0.2;
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.initNodes();
  }

  initNodes() {
    this.nodes = [];
    const count = Math.floor((this.width * this.height) / 25000);
    for (let i = 0; i < count; i++) {
      this.nodes.push(this.createNode());
    }
  }

  createNode() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 1.5 + 1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1
    };
  }

  updateNode(node) {
    node.x += node.vx + (this.mouse.x * 0.02);
    node.y += node.vy + (this.mouse.y * 0.02);

    if (node.x < -20) node.x = this.width + 20;
    if (node.x > this.width + 20) node.x = -20;
    if (node.y < -20) node.y = this.height + 20;
    if (node.y > this.height + 20) node.y = -20;
  }

  drawNode(node) {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(0, 240, 255, ${node.alpha * 0.6})`;
    this.ctx.fill();
  }

  drawConnections() {
    const maxDist = 140;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth mouse damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.drawConnections();

    this.nodes.forEach(node => {
      this.updateNode(node);
      this.drawNode(node);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize background renderer when script loads
document.addEventListener('DOMContentLoaded', () => {
  new BackgroundMeshRenderer('animus-canvas');
});
