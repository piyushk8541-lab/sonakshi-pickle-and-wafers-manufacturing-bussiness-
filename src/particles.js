/**
 * Lightweight Spice & Golden Wafer Dust Canvas Particles
 */

export class SpiceParticlesCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0, vx: 0, vy: 0 };
    this.lastMouse = { x: 0, y: 0 };
    this.isActive = true;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create 45 ambient spice particles
    const colors = [
      'rgba(217, 119, 6, 0.45)',  // Turmeric Gold
      'rgba(185, 28, 28, 0.35)',  // Chili Red
      'rgba(120, 53, 15, 0.40)',  // Mustard Seed
      'rgba(245, 158, 11, 0.30)', // Wafer Flake
      'rgba(34, 197, 94, 0.25)'   // Coriander / Herb
    ];

    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() * 0.4 + 0.15) * (Math.random() > 0.5 ? 1 : -1),
        shape: Math.random() > 0.6 ? 'circle' : (Math.random() > 0.5 ? 'flake' : 'rect'),
        angle: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02
      });
    }

    window.addEventListener('mousemove', (e) => {
      this.mouse.vx = (e.clientX - this.lastMouse.x) * 0.05;
      this.mouse.vy = (e.clientY - this.lastMouse.y) * 0.05;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.lastMouse.x = e.clientX;
      this.lastMouse.y = e.clientY;
    });

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      p.x += p.vx + this.mouse.vx * 0.1;
      p.y += p.vy + this.mouse.vy * 0.1;
      p.angle += p.vRot;

      // Wrap edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'flake') {
        this.ctx.beginPath();
        this.ctx.moveTo(-p.size, -p.size * 0.5);
        this.ctx.lineTo(p.size, -p.size * 0.3);
        this.ctx.lineTo(0, p.size);
        this.ctx.closePath();
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
      }

      this.ctx.restore();
    });

    // Dampen mouse velocity
    this.mouse.vx *= 0.95;
    this.mouse.vy *= 0.95;
  }
}
