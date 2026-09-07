import * as THREE from 'three';
import { soundFX } from './sound-fx.js';

export class Hero3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.jarGroup = null;
    this.waferGroup = null;
    this.particlesGroup = null;
    this.ambientLight = null;
    this.dirLight = null;
    this.pointLight = null;

    this.targetMouse = { x: 0, y: 0 };
    this.currentMouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.isVisible = true;
    this.currentMode = 'all'; // 'all', 'jar', 'wafer'

    this.spinJarVelocity = 0;
    this.spinWaferVelocity = 0;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Build 3D Models
    this.buildPickleJar();
    this.buildWaferChips();
    this.buildSpiceParticles();

    // 6. Event Listeners
    this.setupEvents();

    // 7. Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.dirLight.position.set(5, 8, 6);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);

    // Warm saffron accent rim light
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    rimLight.position.set(-6, 3, -4);
    this.scene.add(rimLight);

    // Crimson spice fill light
    const spiceLight = new THREE.PointLight(0xef4444, 2.0, 10);
    spiceLight.position.set(-2, -3, 3);
    this.scene.add(spiceLight);

    // Golden specular light
    this.pointLight = new THREE.PointLight(0xfcd34d, 2.5, 12);
    this.pointLight.position.set(3, 2, 4);
    this.scene.add(this.pointLight);
  }

  createLabelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich Indian Red & Gold Border Background
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#7A1414');
    grad.addColorStop(0.5, '#9E1B1B');
    grad.addColorStop(1, '#681111');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Gold Double Border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 984, 472);
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 952, 440);

    // Decorative corner flourishes
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 36px serif';
    ctx.fillText('✦', 50, 75);
    ctx.fillText('✦', 940, 75);
    ctx.fillText('✦', 50, 460);
    ctx.fillText('✦', 940, 460);

    // Brand Name
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 82px "Playfair Display", Georgia, serif';
    ctx.fillText('SONAKSHI', 512, 170);

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 34px "DM Sans", sans-serif';
    ctx.letterSpacing = '10px';
    ctx.fillText('— FOOD INDUSTRIES —', 512, 230);

    // Badge ribbon
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(262, 265, 500, 50);
    ctx.fillStyle = '#5B0E0E';
    ctx.font = 'bold 26px "DM Sans", sans-serif';
    ctx.fillText('TRADITIONAL MANGO PICKLE', 512, 300);

    // Tagline
    ctx.fillStyle = '#FDE68A';
    ctx.font = 'italic 28px "Playfair Display", Georgia, serif';
    ctx.fillText('Sun-Matured · 100% Mustard Oil · Zero Preservatives', 512, 380);

    ctx.fillStyle = '#E5E7EB';
    ctx.font = '600 22px "DM Sans", sans-serif';
    ctx.fillText('NET WT. 500g  |  FSSAI CERTIFIED  |  MADE IN INDIA', 512, 435);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  createChipTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Golden fried potato base
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
    grad.addColorStop(0, '#FFE082');
    grad.addColorStop(0.6, '#FFCA28');
    grad.addColorStop(0.9, '#F57F17');
    grad.addColorStop(1, '#D84315');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Add crisp bubbles & potato speckles
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 4 + 1;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(216, 67, 21, 0.45)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Paprika / Chili Flakes specks
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const w = Math.random() * 3 + 1;
      const h = Math.random() * 3 + 1;
      ctx.fillStyle = 'rgba(185, 28, 28, 0.75)';
      ctx.fillRect(x, y, w, h);
    }

    // Herb / Cumin specks
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = 'rgba(46, 125, 50, 0.65)';
      ctx.fillRect(x, y, 2, 4);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  buildPickleJar() {
    this.jarGroup = new THREE.Group();

    // 1. Outer Glass Bottle
    const jarGeo = new THREE.CylinderGeometry(1.2, 1.25, 2.6, 48, 1, false);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.52,
      thickness: 1.2,
      specularIntensity: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const jarMesh = new THREE.Mesh(jarGeo, glassMat);
    jarMesh.castShadow = true;
    jarMesh.receiveShadow = true;
    this.jarGroup.add(jarMesh);

    // 2. Inner Spiced Pickle Content (Rich Spiced Mango Mustard Stew)
    const contentGeo = new THREE.CylinderGeometry(1.1, 1.15, 2.4, 36);
    const contentMat = new THREE.MeshStandardMaterial({
      color: 0xc45710, // Rich mustard turmeric red-gold
      roughness: 0.45,
      metalness: 0.1,
      bumpScale: 0.08
    });
    const contentMesh = new THREE.Mesh(contentGeo, contentMat);
    contentMesh.position.y = -0.05;
    this.jarGroup.add(contentMesh);

    // 3. Jar Neck & Thread
    const neckGeo = new THREE.CylinderGeometry(0.95, 1.18, 0.4, 40);
    const neckMesh = new THREE.Mesh(neckGeo, glassMat);
    neckMesh.position.y = 1.45;
    this.jarGroup.add(neckMesh);

    // 4. Golden Metallic Airtight Cap
    const lidGeo = new THREE.CylinderGeometry(1.02, 1.02, 0.35, 48);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xe6a817, // Golden brass
      metalness: 0.9,
      roughness: 0.22,
      bumpScale: 0.05
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.y = 1.72;
    lidMesh.castShadow = true;
    this.jarGroup.add(lidMesh);

    // Lid top emblem disc
    const lidTopGeo = new THREE.CylinderGeometry(0.96, 0.96, 0.05, 40);
    const lidTopMat = new THREE.MeshStandardMaterial({
      color: 0x9e1b1b, // Crimson center accent
      metalness: 0.7,
      roughness: 0.3
    });
    const lidTopMesh = new THREE.Mesh(lidTopGeo, lidTopMat);
    lidTopMesh.position.y = 1.91;
    this.jarGroup.add(lidTopMesh);

    // 5. Product Brand Label wrap
    const labelGeo = new THREE.CylinderGeometry(1.22, 1.22, 1.4, 48, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
    const labelMat = new THREE.MeshStandardMaterial({
      map: this.createLabelTexture(),
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = -0.05;
    this.jarGroup.add(labelMesh);

    // Position Jar in Scene
    this.jarGroup.position.set(-1.4, 0.1, 0);
    this.jarGroup.rotation.set(0.15, 0.35, -0.08);
    this.scene.add(this.jarGroup);
  }

  buildWaferChips() {
    this.waferGroup = new THREE.Group();

    const chipTexture = this.createChipTexture();
    const chipMat = new THREE.MeshStandardMaterial({
      map: chipTexture,
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide,
      bumpScale: 0.15
    });

    // Create Curved Potato Chip Geometry (Hyperbolic Paraboloid Saddle Shape)
    const createCurvedChipGeo = (width = 1.6, height = 1.4, curvature = 0.35) => {
      const geo = new THREE.PlaneGeometry(width, height, 32, 32);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Saddle curve equation z = c * (x^2 - y^2)
        const z = curvature * (Math.pow(x / (width / 2), 2) - Math.pow(y / (height / 2), 2));
        // Add subtle natural wavy edge irregularity
        const edgeDist = Math.hypot(x, y);
        const ripple = Math.sin(x * 8 + y * 6) * 0.04 * edgeDist;
        pos.setZ(i, z + ripple);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Primary Large Hero Wafer Chip
    const mainChipGeo = createCurvedChipGeo(1.8, 1.5, 0.42);
    const mainChip = new THREE.Mesh(mainChipGeo, chipMat);
    mainChip.castShadow = true;
    mainChip.receiveShadow = true;
    mainChip.position.set(0, 0, 0);
    mainChip.rotation.set(0.4, -0.6, 0.3);
    this.waferGroup.add(mainChip);

    // Secondary Floating Wafer Chip (behind / above)
    const chip2Geo = createCurvedChipGeo(1.3, 1.1, -0.35);
    const chip2 = new THREE.Mesh(chip2Geo, chipMat);
    chip2.position.set(1.2, 1.3, -0.8);
    chip2.rotation.set(-0.5, 0.8, -0.4);
    this.waferGroup.add(chip2);

    // Third Floating Wafer Chip (below / foreground)
    const chip3Geo = createCurvedChipGeo(1.1, 0.9, 0.3);
    const chip3 = new THREE.Mesh(chip3Geo, chipMat);
    chip3.position.set(-0.8, -1.2, 0.6);
    chip3.rotation.set(0.8, 0.3, -0.6);
    this.waferGroup.add(chip3);

    // Position Wafer Group
    this.waferGroup.position.set(1.6, -0.1, 0.4);
    this.scene.add(this.waferGroup);
  }

  buildSpiceParticles() {
    this.particlesGroup = new THREE.Group();

    // 1. Mustard Seeds (Tiny golden spheres)
    const seedGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const seedMat = new THREE.MeshStandardMaterial({
      color: 0x8d5b12,
      roughness: 0.3,
      metalness: 0.2
    });

    this.seedMeshes = [];
    for (let i = 0; i < 35; i++) {
      const mesh = new THREE.Mesh(seedGeo, seedMat);
      mesh.position.set(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      mesh.userData = {
        speedY: (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        speedX: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        rotSpeed: Math.random() * 0.02 + 0.01,
        originY: mesh.position.y
      };
      this.particlesGroup.add(mesh);
      this.seedMeshes.push(mesh);
    }

    // 2. Dried Red Chili Flakes (Irregular triangular crimson plates)
    const chiliGeo = new THREE.BufferGeometry();
    const chiliVertices = new Float32Array([
      -0.08, -0.06, 0.0,
       0.09, -0.04, 0.02,
       0.01,  0.08, -0.02
    ]);
    chiliGeo.setAttribute('position', new THREE.BufferAttribute(chiliVertices, 3));
    chiliGeo.computeVertexNormals();

    const chiliMat = new THREE.MeshStandardMaterial({
      color: 0xcc2929,
      roughness: 0.4,
      side: THREE.DoubleSide
    });

    this.chiliMeshes = [];
    for (let i = 0; i < 25; i++) {
      const mesh = new THREE.Mesh(chiliGeo, chiliMat);
      mesh.position.set(
        (Math.random() - 0.5) * 7.5,
        (Math.random() - 0.5) * 5.5,
        (Math.random() - 0.5) * 4
      );
      mesh.scale.setScalar(Math.random() * 0.9 + 0.7);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = {
        speedY: (Math.random() * 0.005 + 0.002),
        rotX: (Math.random() - 0.5) * 0.04,
        rotY: (Math.random() - 0.5) * 0.04
      };
      this.particlesGroup.add(mesh);
      this.chiliMeshes.push(mesh);
    }

    this.scene.add(this.particlesGroup);
  }

  setupEvents() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.targetMouse.x = (touch.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouse.y = -(touch.clientY / window.innerHeight - 0.5) * 2;
      }
    }, { passive: true });

    // Click interactive action: trigger 360 spin & crunch/pop
    this.container.addEventListener('click', () => {
      this.triggerSpin();
    });

    // Window Resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;

      // Adjust camera distance for mobile
      if (width < 768) {
        this.camera.position.z = 9.2;
        if (this.jarGroup) this.jarGroup.position.x = -0.7;
        if (this.waferGroup) this.waferGroup.position.x = 0.8;
      } else {
        this.camera.position.z = 7.5;
        if (this.jarGroup) this.jarGroup.position.x = -1.4;
        if (this.waferGroup) this.waferGroup.position.x = 1.6;
      }

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    // Visibility Observer for performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(this.container);
  }

  triggerSpin() {
    this.spinJarVelocity = 0.35;
    this.spinWaferVelocity = 0.45;
    soundFX.playJarPop();
    setTimeout(() => soundFX.playCrunch(), 150);
  }

  setMode(mode) {
    this.currentMode = mode;
    // Animate target positions
    if (mode === 'jar') {
      this.jarGroup.visible = true;
      this.waferGroup.visible = false;
    } else if (mode === 'wafer') {
      this.jarGroup.visible = false;
      this.waferGroup.visible = true;
    } else {
      this.jarGroup.visible = true;
      this.waferGroup.visible = true;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (!this.isVisible) return;

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Lerping
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.05;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.05;

    // Jar Animation & Parallax
    if (this.jarGroup && this.jarGroup.visible) {
      this.jarGroup.position.y = 0.1 + Math.sin(elapsedTime * 1.5) * 0.12;
      this.jarGroup.rotation.y = 0.35 + this.currentMouse.x * 0.4 + this.spinJarVelocity;
      this.jarGroup.rotation.x = 0.15 - this.currentMouse.y * 0.3;
      this.jarGroup.rotation.z = -0.08 + Math.sin(elapsedTime * 0.9) * 0.03;

      if (this.spinJarVelocity > 0.001) {
        this.spinJarVelocity *= 0.92;
      } else {
        this.spinJarVelocity = 0;
      }
    }

    // Wafer Animation & Parallax
    if (this.waferGroup && this.waferGroup.visible) {
      this.waferGroup.position.y = -0.1 + Math.cos(elapsedTime * 1.8) * 0.14;
      this.waferGroup.rotation.y = -0.4 + this.currentMouse.x * 0.5 + this.spinWaferVelocity;
      this.waferGroup.rotation.x = 0.2 + this.currentMouse.y * 0.35;
      this.waferGroup.rotation.z = 0.15 + Math.sin(elapsedTime * 1.2) * 0.05;

      if (this.spinWaferVelocity > 0.001) {
        this.spinWaferVelocity *= 0.91;
      } else {
        this.spinWaferVelocity = 0;
      }
    }

    // Spice Particles Animation
    if (this.seedMeshes) {
      this.seedMeshes.forEach((seed, idx) => {
        seed.position.y += Math.sin(elapsedTime * 1.2 + idx) * 0.003;
        seed.position.x += Math.cos(elapsedTime * 0.8 + idx) * 0.002;
        seed.rotation.x += seed.userData.rotSpeed;
        seed.rotation.y += seed.userData.rotSpeed;
      });
    }

    if (this.chiliMeshes) {
      this.chiliMeshes.forEach((chili, idx) => {
        chili.position.y += Math.cos(elapsedTime * 1.4 + idx) * 0.004;
        chili.rotation.x += chili.userData.rotX;
        chili.rotation.y += chili.userData.rotY;
      });
    }

    // Dynamic light movement
    if (this.pointLight) {
      this.pointLight.position.x = 3 + this.currentMouse.x * 2;
      this.pointLight.position.y = 2 + this.currentMouse.y * 2;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
