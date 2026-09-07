import * as THREE from 'three';
import { soundFX } from './sound-fx.js';
import { cartStore } from './cart-store.js';

export class Product3DViewer {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.activeGroup = null;
    this.currentProduct = null;
    this.currentSizeIndex = 0;
    this.currentQuantity = 1;

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.autoRotate = true;
    this.autoRotateSpeed = 0.008;

    this.burstParticles = [];

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    this.camera.position.set(0, 0, 5.8);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);

    // Studio Lights
    const ambient = new THREE.AmbientLight(0xfff5ea, 1.6);
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(4, 6, 4);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.4);
    dirLight2.position.set(-4, -2, -3);
    this.scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0xffffff, 2.0, 8);
    rimLight.position.set(0, 3, 3);
    this.scene.add(rimLight);

    this.setupControls();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupControls() {
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging || !this.activeGroup) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.activeGroup.rotation.y += deltaX * 0.012;
      this.activeGroup.rotation.x += deltaY * 0.01;
      this.activeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, this.activeGroup.rotation.x));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Zoom on wheel
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.position.z += e.deltaY * 0.003;
      this.camera.position.z = Math.max(3.8, Math.min(8.0, this.camera.position.z));
    }, { passive: false });
  }

  loadProduct(product) {
    this.currentProduct = product;
    this.currentSizeIndex = 0;
    this.currentQuantity = 1;

    if (this.activeGroup) {
      this.scene.remove(this.activeGroup);
    }

    this.activeGroup = new THREE.Group();

    if (product.category === 'pickle') {
      this.createJarModel(product);
    } else {
      this.createWaferModel(product);
    }

    this.scene.add(this.activeGroup);
    this.updateModalUI();
  }

  createJarModel(product) {
    // Glass
    const jarGeo = new THREE.CylinderGeometry(1.0, 1.05, 2.2, 40);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      transparent: true,
      roughness: 0.06,
      ior: 1.5,
      thickness: 1.0
    });
    const jarMesh = new THREE.Mesh(jarGeo, glassMat);
    this.activeGroup.add(jarMesh);

    // Dynamic Color based on pickle type
    let stewColor = 0xb85d19;
    if (product.id.includes('lemon')) stewColor = 0xd99b00;
    if (product.id.includes('garlic') || product.id.includes('red-chilli')) stewColor = 0xa31e1e;
    if (product.id.includes('mixed')) stewColor = 0x9b4b1a;

    const stewGeo = new THREE.CylinderGeometry(0.92, 0.96, 2.05, 32);
    const stewMat = new THREE.MeshStandardMaterial({
      color: stewColor,
      roughness: 0.45
    });
    const stewMesh = new THREE.Mesh(stewGeo, stewMat);
    this.activeGroup.add(stewMesh);

    // Lid
    const lidGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.3, 36);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xdfa015,
      metalness: 0.9,
      roughness: 0.2
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.y = 1.25;
    this.activeGroup.add(lidMesh);

    // Dynamic Label
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const ctx = labelCanvas.getContext('2d');
    ctx.fillStyle = '#8B1E19';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px "Playfair Display", serif';
    ctx.fillText('SONAKSHI', 256, 75);
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(product.name.toUpperCase(), 256, 125);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.fillText('Authentic Traditional Recipe · 100% Pure', 256, 175);
    ctx.fillText('FSSAI GRADE A HYGIENE', 256, 215);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelGeo = new THREE.CylinderGeometry(1.02, 1.02, 1.1, 40, 1, true, -Math.PI * 0.7, Math.PI * 1.4);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      side: THREE.DoubleSide
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    this.activeGroup.add(labelMesh);
  }

  createWaferModel(product) {
    const width = 2.0;
    const height = 1.6;
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = 0.4 * (Math.pow(x / 1.0, 2) - Math.pow(y / 0.8, 2)) + Math.sin(x * 6 + y * 6) * 0.05;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();

    let baseColor = '#FFD54F';
    if (product.id.includes('masala')) baseColor = '#FF8F00';
    if (product.id.includes('tomato')) baseColor = '#E65100';
    if (product.id.includes('cheese')) baseColor = '#FFE082';

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(185, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.6,
      side: THREE.DoubleSide
    });

    const waferMesh = new THREE.Mesh(geo, mat);
    this.activeGroup.add(waferMesh);
  }

  triggerBurst() {
    soundFX.playJarPop();
    soundFX.playCrunch();

    // Spawn 40 flying spice meshes
    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });

    for (let i = 0; i < 35; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      p.position.set(0, 0, 0);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = Math.random() * 0.08 + 0.04;
      p.userData = {
        vel: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.cos(phi) * speed,
          Math.sin(phi) * Math.sin(theta) * speed
        ),
        life: 1.0
      };
      this.scene.add(p);
      this.burstParticles.push(p);
    }
  }

  updateModalUI() {
    if (!this.currentProduct) return;
    const modal = document.getElementById('product-3d-modal');
    if (!modal) return;

    modal.querySelector('.modal-title').textContent = this.currentProduct.name;
    modal.querySelector('.modal-hindi').textContent = this.currentProduct.hindiName || '';
    modal.querySelector('.modal-desc').textContent = this.currentProduct.description;
    modal.querySelector('.modal-shelf').textContent = this.currentProduct.shelfLife || '12 Months';
    modal.querySelector('.modal-pack').textContent = this.currentProduct.packaging || 'Air-Tight Sealed';

    // Ingredients list
    const ingList = modal.querySelector('.modal-ingredients');
    if (ingList) {
      ingList.innerHTML = this.currentProduct.ingredients.map(ing => `<li><span>✦</span> ${ing}</li>`).join('');
    }

    // Nutrition values
    const nutGrid = modal.querySelector('.modal-nutrition');
    if (nutGrid && this.currentProduct.nutrition) {
      nutGrid.innerHTML = Object.entries(this.currentProduct.nutrition).map(([k, v]) => `
        <div class="nut-item">
          <small>${k.toUpperCase()}</small>
          <strong>${v}</strong>
        </div>
      `).join('');
    }

    // Size Pills
    const sizeContainer = modal.querySelector('.modal-sizes');
    if (sizeContainer) {
      sizeContainer.innerHTML = this.currentProduct.sizes.map((s, idx) => `
        <button class="size-pill ${idx === this.currentSizeIndex ? 'active' : ''}" data-index="${idx}">
          ${s.label || s.size} — <b>₹${s.price}</b>
        </button>
      `).join('');

      sizeContainer.querySelectorAll('.size-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          this.currentSizeIndex = idx;
          this.updateModalUI();
        });
      });
    }

    const currentSize = this.currentProduct.sizes[this.currentSizeIndex];
    const priceEl = modal.querySelector('.modal-current-price');
    if (priceEl && currentSize) {
      priceEl.innerHTML = `₹${currentSize.price * this.currentQuantity} <small>(₹${currentSize.price} / ${currentSize.size})</small>`;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    if (this.activeGroup && this.autoRotate && !this.isDragging) {
      this.activeGroup.rotation.y += this.autoRotateSpeed;
    }

    // Animate burst particles
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const p = this.burstParticles[i];
      p.position.add(p.userData.vel);
      p.userData.life -= 0.02;
      p.scale.setScalar(p.userData.life);
      if (p.userData.life <= 0) {
        this.scene.remove(p);
        this.burstParticles.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
