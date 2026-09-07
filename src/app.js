import confetti from 'canvas-confetti';
import { getProducts, saveCustomPrice, resetAllPrices } from './products-data.js';
import { cartStore } from './cart-store.js';
import { soundFX } from './sound-fx.js';
import { Hero3DScene } from './three-hero.js';
import { Product3DViewer } from './three-product-viewer.js';
import { SpiceParticlesCanvas } from './particles.js';

class SonakshiApp {
  constructor() {
    this.products = getProducts();
    this.hero3D = null;
    this.product3D = null;
    this.particles = null;
    this.activePickleFilter = 'all';
    this.activeWaferFilter = 'all';
    this.searchQuery = '';

    // Selected size index per product card { [productId]: sizeIndex }
    this.selectedSizes = {};
    // Selected quantity per product card { [productId]: quantity }
    this.selectedQuantities = {};

    this.init();
  }

  init() {
    // 1. Initialize 3D & Canvas
    try {
      this.hero3D = new Hero3DScene('hero-3d-canvas-wrapper');
      this.particles = new SpiceParticlesCanvas('spice-particle-canvas');
      this.product3D = new Product3DViewer('product-3d-turntable');
    } catch (e) {
      console.warn('WebGL / 3D Canvas initialization notice:', e);
    }

    // 2. Initialize UI & Catalogs
    this.renderPicklesCatalog();
    this.renderWafersCatalog();
    this.setupCartDrawer();
    this.setupFiltersAndSearch();
    this.setupWholesaleCalculator();
    this.setupContactForm();
    this.setupNavigation();
    this.setupSoundControls();
    this.setupPriceManager();
    this.setupIntersectionObserver();
    this.setup3DCardTilt();

    // Subscribe to Cart State updates
    cartStore.subscribe((state) => {
      this.updateCartBadges(state);
      this.renderCartDrawerItems(state);
    });

    console.log('🌶️ Sonakshi Food Web Application initialized successfully!');
  }

  /* -------------------------------------------------------------
     RENDER CATALOGS
  ------------------------------------------------------------- */
  renderPicklesCatalog() {
    const grid = document.getElementById('pickles-grid');
    if (!grid) return;

    const filtered = this.products.pickles.filter((p) => {
      const matchesSearch = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.ingredients.some(i => i.toLowerCase().includes(this.searchQuery.toLowerCase()));

      let matchesFilter = true;
      if (this.activePickleFilter === 'bestseller') matchesFilter = p.badge.includes('Best') || p.badge.includes('Favorite');
      else if (this.activePickleFilter === 'spicy') matchesFilter = p.spiceLevel >= 4;
      else if (this.activePickleFilter === 'tangy') matchesFilter = p.tasteProfile.toLowerCase().includes('tangy') || p.tasteProfile.toLowerCase().includes('zesty');

      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-msg">
          <p>🔍 No pickles found matching "<b>${this.searchQuery}</b>"</p>
          <button class="button button-outline" id="reset-pickle-search">Clear Search Filter</button>
        </div>
      `;
      document.getElementById('reset-pickle-search')?.addEventListener('click', () => {
        this.searchQuery = '';
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = '';
        this.renderPicklesCatalog();
        this.renderWafersCatalog();
      });
      return;
    }

    grid.innerHTML = filtered.map((p) => this.createProductCardHtml(p)).join('');
    this.attachCardEventListeners(grid);
  }

  renderWafersCatalog() {
    const grid = document.getElementById('wafers-grid');
    if (!grid) return;

    const filtered = this.products.wafers.filter((p) => {
      const matchesSearch = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.ingredients.some(i => i.toLowerCase().includes(this.searchQuery.toLowerCase()));

      let matchesFilter = true;
      if (this.activeWaferFilter === 'classic') matchesFilter = p.id.includes('salted') || p.id.includes('masala');
      else if (this.activeWaferFilter === 'spicy') matchesFilter = p.id.includes('masala') || p.id.includes('special');
      else if (this.activeWaferFilter === 'gourmet') matchesFilter = p.id.includes('cheese') || p.id.includes('tomato');

      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-msg">
          <p>🔍 No wafers found matching "<b>${this.searchQuery}</b>"</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((p) => this.createProductCardHtml(p)).join('');
    this.attachCardEventListeners(grid);
  }

  createProductCardHtml(p) {
    const selectedIdx = this.selectedSizes[p.id] !== undefined ? this.selectedSizes[p.id] : 0;
    const currentSize = p.sizes[selectedIdx] || p.sizes[0];
    const qty = this.selectedQuantities[p.id] || 1;
    const isPickle = p.category === 'pickle';

    // Spice or Crispiness Rating
    const ratingHtml = isPickle ? `
      <div class="spice-meter" title="Spice Heat: ${p.spiceLevel}/5">
        <span class="spice-label">Spice:</span>
        <span class="spice-icons">${'🌶️'.repeat(p.spiceLevel)}</span>
      </div>
    ` : `
      <div class="crisp-meter">
        <span class="crisp-badge">⚡ ${p.crispScore || '10/10 Crisp'}</span>
      </div>
    `;

    return `
      <article class="product-card tilt-card" data-product-id="${p.id}" data-category="${p.category}">
        <div class="card-glass-glow"></div>
        <div class="card-badge-row">
          <span class="product-badge">${p.badge}</span>
          ${ratingHtml}
        </div>

        <div class="product-image-box">
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="product-img" />
          <button class="inspect-3d-btn" title="Inspect 3D 360° View" data-product-id="${p.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span>3D View</span>
          </button>
        </div>

        <div class="product-body">
          <div class="product-header">
            <h3 class="product-title">${p.name}</h3>
            ${p.hindiName ? `<span class="product-hindi-name">${p.hindiName}</span>` : ''}
          </div>

          <p class="product-desc">${p.shortDesc}</p>

          <div class="product-ingredients-snippet">
            <strong>Key Ingredients:</strong>
            <span>${p.ingredients.slice(0, 4).join(', ')}${p.ingredients.length > 4 ? '...' : ''}</span>
          </div>

          <!-- Size Selector Pills -->
          <div class="size-selector-group">
            <label class="size-label">Select Pack Size:</label>
            <div class="size-pills">
              ${p.sizes.map((s, idx) => `
                <button type="button" class="size-pill-btn ${idx === selectedIdx ? 'active' : ''}" data-product-id="${p.id}" data-index="${idx}">
                  ${s.size}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Dynamic Price & Rate info -->
          <div class="price-row">
            <div class="price-display">
              <span class="price-currency">₹</span>
              <span class="price-number" data-price-target="${p.id}">${currentSize.price * qty}</span>
              <span class="price-unit-tag">/ ${currentSize.size}</span>
            </div>
            <button class="edit-rate-trigger" data-product-id="${p.id}" data-size="${currentSize.size}" title="Customize Rate Placeholder">
              ✏️ Rate
            </button>
          </div>

          <!-- Quantity Stepper & Add to Cart -->
          <div class="card-action-row">
            <div class="quantity-stepper">
              <button type="button" class="qty-btn qty-minus" data-product-id="${p.id}" aria-label="Decrease quantity">−</button>
              <span class="qty-val" data-qty-target="${p.id}">${qty}</span>
              <button type="button" class="qty-btn qty-plus" data-product-id="${p.id}" aria-label="Increase quantity">+</button>
            </div>

            <button type="button" class="button button-add-cart" data-product-id="${p.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  attachCardEventListeners(container) {
    // 1. Size Pill Click
    container.querySelectorAll('.size-pill-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.dataset.productId;
        const idx = Number(e.currentTarget.dataset.index);
        this.selectedSizes[prodId] = idx;

        const allProds = [...this.products.pickles, ...this.products.wafers];
        const prod = allProds.find(p => p.id === prodId);
        if (prod) {
          if (prod.category === 'pickle') this.renderPicklesCatalog();
          else this.renderWafersCatalog();
        }
      });
    });

    // 2. Quantity Plus/Minus
    container.querySelectorAll('.qty-plus').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.dataset.productId;
        this.selectedQuantities[prodId] = (this.selectedQuantities[prodId] || 1) + 1;
        this.updateCardPrice(prodId);
      });
    });

    container.querySelectorAll('.qty-minus').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.dataset.productId;
        const current = this.selectedQuantities[prodId] || 1;
        if (current > 1) {
          this.selectedQuantities[prodId] = current - 1;
          this.updateCardPrice(prodId);
        }
      });
    });

    // 3. Add to Cart Button Click
    container.querySelectorAll('.button-add-cart').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.dataset.productId;
        this.handleAddToCart(prodId, e.currentTarget);
      });
    });

    // 4. Inspect 3D Button Click
    container.querySelectorAll('.inspect-3d-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.dataset.productId;
        this.open3DModal(prodId);
      });
    });

    // 5. Rate Customizer Trigger
    container.querySelectorAll('.edit-rate-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.dataset.productId;
        const size = e.currentTarget.dataset.size;
        this.openPriceCustomizer(prodId, size);
      });
    });

    // Reapply 3D Tilt
    this.setup3DCardTilt();
  }

  updateCardPrice(prodId) {
    const allProds = [...this.products.pickles, ...this.products.wafers];
    const prod = allProds.find(p => p.id === prodId);
    if (!prod) return;

    const selectedIdx = this.selectedSizes[prodId] || 0;
    const sizeObj = prod.sizes[selectedIdx] || prod.sizes[0];
    const qty = this.selectedQuantities[prodId] || 1;

    const priceEl = document.querySelector(`[data-price-target="${prodId}"]`);
    const qtyEl = document.querySelector(`[data-qty-target="${prodId}"]`);

    if (priceEl) priceEl.textContent = sizeObj.price * qty;
    if (qtyEl) qtyEl.textContent = qty;
  }

  handleAddToCart(prodId, btnElement) {
    const allProds = [...this.products.pickles, ...this.products.wafers];
    const prod = allProds.find(p => p.id === prodId);
    if (!prod) return;

    const selectedIdx = this.selectedSizes[prodId] || 0;
    const sizeObj = prod.sizes[selectedIdx] || prod.sizes[0];
    const qty = this.selectedQuantities[prodId] || 1;

    cartStore.addItem(prod, sizeObj, qty);

    // Play Sound FX
    if (prod.category === 'pickle') {
      soundFX.playJarPop();
    } else {
      soundFX.playCrunch();
    }
    soundFX.playCartAdd();

    // Button animation feedback
    btnElement.classList.add('added');
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>Added!</span>
    `;

    setTimeout(() => {
      btnElement.classList.remove('added');
      btnElement.innerHTML = originalText;
    }, 1200);

    // Trigger Mini Confetti Burst at button location
    const rect = btnElement.getBoundingClientRect();
    confetti({
      particleCount: 22,
      spread: 55,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      },
      colors: ['#D97706', '#9E1B1B', '#F59E0B', '#22C55E']
    });

    // Show Toast Notification
    this.showToast(
      `Added to Cart!`,
      `${qty}x ${prod.name} (${sizeObj.size}) added to your order.`,
      'success'
    );
  }

  /* -------------------------------------------------------------
     3D PRODUCT INSPECTOR MODAL
  ------------------------------------------------------------- */
  open3DModal(prodId) {
    const allProds = [...this.products.pickles, ...this.products.wafers];
    const prod = allProds.find(p => p.id === prodId);
    if (!prod) return;

    const modal = document.getElementById('product-3d-modal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    if (this.product3D) {
      this.product3D.loadProduct(prod);
    }

    // Modal Add To Cart
    const modalAddBtn = modal.querySelector('#modal-add-to-cart-btn');
    if (modalAddBtn) {
      modalAddBtn.onclick = () => {
        const sizeIdx = this.product3D ? this.product3D.currentSizeIndex : 0;
        const sizeObj = prod.sizes[sizeIdx];
        cartStore.addItem(prod, sizeObj, 1);
        soundFX.playCartAdd();
        this.showToast('Added to Cart', `${prod.name} (${sizeObj.size}) added.`, 'success');
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      };
    }

    // Burst Seasoning Button
    const burstBtn = modal.querySelector('#modal-burst-spices-btn');
    if (burstBtn && this.product3D) {
      burstBtn.onclick = () => this.product3D.triggerBurst();
    }
  }

  /* -------------------------------------------------------------
     CART & ORDER SUMMARY DRAWER
  ------------------------------------------------------------- */
  setupCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    const openBtns = document.querySelectorAll('.open-cart-trigger');
    const closeBtn = document.getElementById('close-cart-btn');
    const clearBtn = document.getElementById('clear-cart-btn');

    openBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.classList.add('drawer-open');
      });
    });

    const closeCart = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('drawer-open');
    };

    closeBtn?.addEventListener('click', closeCart);
    overlay?.addEventListener('click', closeCart);

    clearBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        cartStore.clearCart();
        this.showToast('Cart Cleared', 'All items have been removed.', 'info');
      }
    });

    // WhatsApp Instant Order button from Drawer
    const waDrawerBtn = document.getElementById('drawer-whatsapp-btn');
    waDrawerBtn?.addEventListener('click', () => {
      const state = cartStore.getState();
      if (state.items.length === 0) {
        alert('Your cart is empty! Please add some delicious pickles or wafers first.');
        return;
      }
      const notes = document.getElementById('drawer-order-notes')?.value || '';
      const waUrl = cartStore.generateWhatsAppUrl({}, notes);
      if (waUrl) window.open(waUrl, '_blank');
    });

    // Proceed to Checkout Form Modal
    const checkoutBtn = document.getElementById('drawer-checkout-btn');
    checkoutBtn?.addEventListener('click', () => {
      const state = cartStore.getState();
      if (state.items.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      closeCart();
      this.openCheckoutModal();
    });
  }

  updateCartBadges(state) {
    document.querySelectorAll('.cart-count-badge').forEach((badge) => {
      badge.textContent = state.totalCount;
      badge.style.display = state.totalCount > 0 ? 'inline-flex' : 'none';
      badge.classList.add('bounce');
      setTimeout(() => badge.classList.remove('bounce'), 300);
    });

    // Floating Mobile Cart Pill
    const floatPill = document.getElementById('floating-cart-pill');
    if (floatPill) {
      if (state.totalCount > 0) {
        floatPill.classList.add('visible');
        floatPill.querySelector('.float-count').textContent = `${state.totalCount} item${state.totalCount > 1 ? 's' : ''}`;
        floatPill.querySelector('.float-total').textContent = `₹${state.subtotal}`;
      } else {
        floatPill.classList.remove('visible');
      }
    }
  }

  renderCartDrawerItems(state) {
    const listContainer = document.getElementById('cart-drawer-items');
    const emptyState = document.getElementById('cart-empty-state');
    const footerContainer = document.getElementById('cart-drawer-footer');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const totalEl = document.getElementById('cart-total-val');
    const progressFill = document.getElementById('free-delivery-fill');
    const progressText = document.getElementById('free-delivery-text');

    if (!listContainer) return;

    if (state.items.length === 0) {
      listContainer.innerHTML = '';
      emptyState.style.display = 'block';
      footerContainer.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    footerContainer.style.display = 'block';

    // Free delivery meter
    if (progressFill && progressText) {
      const percent = Math.min(100, (state.subtotal / state.freeDeliveryThreshold) * 100);
      progressFill.style.width = `${percent}%`;
      if (state.isFreeDelivery) {
        progressText.innerHTML = `🎉 <b>Congratulations!</b> You unlocked <b>FREE Standard Delivery</b>!`;
      } else {
        progressText.innerHTML = `Add <b>₹${state.remainingForFreeDelivery}</b> more for <b>FREE Delivery</b>`;
      }
    }

    if (subtotalEl) subtotalEl.textContent = `₹${state.subtotal}`;
    if (totalEl) totalEl.textContent = `₹${state.subtotal}`;

    listContainer.innerHTML = state.items.map((item) => `
      <div class="cart-item-row" data-item-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-size">${item.sizeLabel}</span>
          <div class="cart-item-price-calc">₹${item.price} × ${item.quantity} = <b>₹${item.price * item.quantity}</b></div>
          <div class="cart-item-controls">
            <div class="cart-item-stepper">
              <button class="stepper-btn stepper-minus" data-id="${item.id}">−</button>
              <span class="stepper-qty">${item.quantity}</span>
              <button class="stepper-btn stepper-plus" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" title="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach Stepper & Remove handlers
    listContainer.querySelectorAll('.stepper-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (item) cartStore.updateQuantity(id, item.quantity + 1);
      });
    });

    listContainer.querySelectorAll('.stepper-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (item) cartStore.updateQuantity(id, item.quantity - 1);
      });
    });

    listContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const removed = cartStore.removeItem(id);
        if (removed) {
          this.showToast('Item Removed', `${removed.name} removed from cart.`, 'info');
        }
      });
    });
  }

  /* -------------------------------------------------------------
     CHECKOUT & WHATSAPP MODAL
  ------------------------------------------------------------- */
  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    const form = modal.querySelector('#checkout-form');
    const state = cartStore.getState();

    // Fill order summary inside checkout
    const sumEl = modal.querySelector('#checkout-items-summary');
    if (sumEl) {
      sumEl.innerHTML = state.items.map(i => `
        <div class="checkout-sum-row">
          <span>${i.name} (${i.size}) × ${i.quantity}</span>
          <b>₹${i.price * i.quantity}</b>
        </div>
      `).join('') + `
        <div class="checkout-sum-total">
          <strong>Total Payable:</strong>
          <strong>₹${state.subtotal}</strong>
        </div>
      `;
    }

    form.onsubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const customer = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        orderType: formData.get('orderType'),
        address: formData.get('address'),
        city: formData.get('city'),
        pincode: formData.get('pincode')
      };
      const notes = formData.get('notes') || '';

      const waUrl = cartStore.generateWhatsAppUrl(customer, notes);
      if (waUrl) {
        window.open(waUrl, '_blank');
        this.showToast('Order Ready!', 'Redirecting to WhatsApp to send order...', 'success');
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    };
  }

  /* -------------------------------------------------------------
     PRICE RATE CUSTOMIZER MODAL
  ------------------------------------------------------------- */
  openPriceCustomizer(prodId, currentSize) {
    const allProds = [...this.products.pickles, ...this.products.wafers];
    const prod = allProds.find(p => p.id === prodId);
    if (!prod) return;

    const modal = document.getElementById('price-manager-modal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    modal.querySelector('.price-manager-title').textContent = `Customize Rates — ${prod.name}`;

    const form = modal.querySelector('#price-manager-form');
    form.innerHTML = `
      <p class="manager-note">You can adjust default rates for each jar/pack size below. Updated rates persist in your browser for demonstrations and quoting.</p>
      ${prod.sizes.map((s) => `
        <div class="price-input-row">
          <label>${s.label || s.size}:</label>
          <div class="input-with-currency">
            <span>₹</span>
            <input type="number" name="${s.size}" value="${s.price}" min="1" step="1" required />
          </div>
        </div>
      `).join('')}
      <div class="modal-btn-row">
        <button type="submit" class="button button-dark">Save Rates</button>
        <button type="button" class="button button-outline" id="close-price-manager">Cancel</button>
      </div>
    `;

    form.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      prod.sizes.forEach((s) => {
        const val = fd.get(s.size);
        if (val) {
          saveCustomPrice(prod.id, s.size, val);
        }
      });

      this.products = getProducts();
      this.renderPicklesCatalog();
      this.renderWafersCatalog();
      this.showToast('Rates Updated', `New prices saved for ${prod.name}!`, 'success');
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    modal.querySelector('#close-price-manager').onclick = () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    };
  }

  setupPriceManager() {
    // Reset all rates button in footer if present
    document.getElementById('reset-all-prices-btn')?.addEventListener('click', () => {
      if (confirm('Reset all product rates back to default factory pricing?')) {
        resetAllPrices();
        this.products = getProducts();
        this.renderPicklesCatalog();
        this.renderWafersCatalog();
        this.showToast('Prices Reset', 'All product prices restored to default.', 'info');
      }
    });
  }

  /* -------------------------------------------------------------
     WHOLESALE B2B CALCULATOR
  ------------------------------------------------------------- */
  setupWholesaleCalculator() {
    const calcType = document.getElementById('ws-product-type');
    const calcQuantity = document.getElementById('ws-carton-count');
    const outputKg = document.getElementById('ws-calc-kg');
    const outputPrice = document.getElementById('ws-calc-est-price');
    const outputDiscount = document.getElementById('ws-calc-discount');
    const waQuoteBtn = document.getElementById('ws-request-quote-btn');

    const updateCalc = () => {
      if (!calcType || !calcQuantity) return;
      const type = calcType.value; // 'mango-pickle', 'lemon-pickle', 'salted-wafer', 'masala-wafer'
      const cartons = parseInt(calcQuantity.value, 10) || 10;

      let baseCartonPrice = 4500;
      let kgPerCarton = 24;

      if (type.includes('wafer')) {
        baseCartonPrice = 2200;
        kgPerCarton = 12;
      }

      let discountPercent = 5;
      if (cartons >= 50) discountPercent = 20;
      else if (cartons >= 25) discountPercent = 15;
      else if (cartons >= 10) discountPercent = 10;

      const rawTotal = baseCartonPrice * cartons;
      const discountedTotal = Math.round(rawTotal * (1 - discountPercent / 100));

      if (outputKg) outputKg.textContent = `${cartons * kgPerCarton} kg`;
      if (outputDiscount) outputDiscount.textContent = `${discountPercent}% Bulk Tier Discount`;
      if (outputPrice) outputPrice.textContent = `₹${discountedTotal.toLocaleString('en-IN')}`;
    };

    calcType?.addEventListener('change', updateCalc);
    calcQuantity?.addEventListener('input', updateCalc);
    updateCalc();

    waQuoteBtn?.addEventListener('click', () => {
      const type = calcType?.options[calcType.selectedIndex]?.text || 'Assorted Varieties';
      const cartons = calcQuantity?.value || '10';
      const msg = `🏭 *WHOLESALE / DISTRIBUTOR ENQUIRY — SONAKSHI FOOD*\n\n` +
        `• *Product Selected:* ${type}\n` +
        `• *Quantity Required:* ${cartons} Cartons\n` +
        `• *Enquiry Type:* Wholesale Dealership / Commercial Supply\n\n` +
        `Please share your official wholesale rate sheet, freight terms, and dealership onboarding requirements.\n\n` +
        `Contact Phone: +91 9234610543 | piyushk8541@gmail.com`;

      const url = `https://wa.me/919234610543?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }

  /* -------------------------------------------------------------
     FILTERS, SEARCH & NAVIGATION
  ------------------------------------------------------------- */
  setupFiltersAndSearch() {
    // Pickle category filters
    document.querySelectorAll('[data-pickle-filter]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-pickle-filter]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activePickleFilter = e.currentTarget.dataset.pickleFilter;
        this.renderPicklesCatalog();
      });
    });

    // Wafer category filters
    document.querySelectorAll('[data-wafer-filter]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-wafer-filter]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeWaferFilter = e.currentTarget.dataset.waferFilter;
        this.renderWafersCatalog();
      });
    });

    // Global Search Input
    const searchInput = document.getElementById('global-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim();
      this.renderPicklesCatalog();
      this.renderWafersCatalog();
    });

    // Hero 3D Mode Toggle Buttons
    document.querySelectorAll('[data-hero-3d-mode]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-hero-3d-mode]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.dataset.hero3dMode;
        if (this.hero3D) this.hero3D.setMode(mode);
      });
    });
  }

  setupNavigation() {
    const header = document.querySelector('.site-header');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-nav-menu');

    // Sticky Header Scroll state
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }, { passive: true });

    // Mobile Hamburger
    mobileToggle?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('open');
      mobileToggle?.classList.toggle('active');
    });

    // Close mobile menu on anchor click
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu?.classList.remove('open');
        mobileToggle?.classList.remove('active');
      });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Modal close buttons (all general modals)
    document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach((el) => {
      el.addEventListener('click', (e) => {
        const modal = e.target.closest('.app-modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        }
      });
    });
  }

  setupSoundControls() {
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (!soundToggleBtn) return;

    const updateSoundUI = () => {
      const isMuted = soundFX.isMuted();
      soundToggleBtn.setAttribute('aria-pressed', (!isMuted).toString());
      soundToggleBtn.innerHTML = isMuted ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        <span class="sr-only">Unmute Sound</span>
      ` : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        <span class="sr-only">Mute Sound</span>
      `;
    };

    soundToggleBtn.addEventListener('click', () => {
      const muted = soundFX.toggleMute();
      updateSoundUI();
      if (!muted) {
        soundFX.playCrunch();
      }
    });

    updateSoundUI();
  }

  setupContactForm() {
    const form = document.getElementById('main-contact-form');
    const status = document.getElementById('contact-form-status');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name') || '';
      const email = fd.get('email') || '';
      const phone = fd.get('phone') || '';
      const inquiryType = fd.get('inquiryType') || 'General Inquiry';
      const message = fd.get('message') || '';

      if (status) {
        status.innerHTML = `
          <div class="status-success">
            ✨ Thank you, <b>${name}</b>! Your enquiry has been received. Our team will get back to you shortly at <b>${phone || email}</b>.
            <div style="margin-top:8px;">
              <a href="https://wa.me/919234610543?text=${encodeURIComponent(`Hi Sonakshi Food, I submitted an enquiry regarding: ${inquiryType}\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`)}" target="_blank" class="text-link" style="color:var(--gold-500);font-weight:600;">
                Click here to also chat on WhatsApp ↗
              </a>
            </div>
          </div>
        `;
      }

      soundFX.playCartAdd();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 }
      });

      form.reset();
    });
  }

  setup3DCardTilt() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const amount = 8;
        card.style.transform = `perspective(1000px) rotateX(${-y * amount}deg) rotateY(${x * amount}deg) translateY(-6px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  setupIntersectionObserver() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Animate stat numbers if stat item
          if (entry.target.classList.contains('stat-number') && !entry.target.dataset.animated) {
            this.animateStatCounter(entry.target);
          }
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .stat-number').forEach((el) => revealObserver.observe(el));
  }

  animateStatCounter(el) {
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.target, 10) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = `${prefix}${current.toLocaleString('en-IN')}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${target.toLocaleString('en-IN')}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  }

  showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `app-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        ${type === 'success' ? '✓' : 'ℹ'}
      </div>
      <div class="toast-content">
        <strong class="toast-title">${title}</strong>
        <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 250);
    });

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 250);
      }
    }, 3800);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new SonakshiApp();
});
