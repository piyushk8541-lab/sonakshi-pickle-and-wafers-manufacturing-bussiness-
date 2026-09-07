/**
 * Sonakshi Food - Cart & Order Management Store
 * Supports In-Memory & LocalStorage persistence, Live Badges & WhatsApp Checkout
 */

const CART_STORAGE_KEY = 'sonakshi_food_cart_items';
const WHATSAPP_NUMBER = '919234610543'; // Business phone: 9234610543

class CartStore {
  constructor() {
    this.items = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => cb(state));
  }

  getState() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const freeDeliveryThreshold = 500;
    const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
    const isFreeDelivery = subtotal >= freeDeliveryThreshold;

    return {
      items: [...this.items],
      totalCount,
      subtotal,
      freeDeliveryThreshold,
      remainingForFreeDelivery,
      isFreeDelivery
    };
  }

  addItem(product, sizeObj, quantity = 1) {
    const itemId = `${product.id}-${sizeObj.size}`;
    const existingIndex = this.items.findIndex((item) => item.id === itemId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: itemId,
        productId: product.id,
        name: product.name,
        hindiName: product.hindiName || '',
        category: product.category,
        image: product.image,
        size: sizeObj.size,
        sizeLabel: sizeObj.label || sizeObj.size,
        price: Number(sizeObj.price),
        quantity: Number(quantity)
      });
    }

    this.saveCart();
    return {
      itemId,
      productName: product.name,
      size: sizeObj.size,
      quantity,
      price: sizeObj.price
    };
  }

  updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    const item = this.items.find((i) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  removeItem(itemId) {
    const removedItem = this.items.find((i) => i.id === itemId);
    this.items = this.items.filter((i) => i.id !== itemId);
    this.saveCart();
    return removedItem;
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  /**
   * Format and generate WhatsApp Checkout URL
   */
  generateWhatsAppUrl(customerDetails = {}, orderNotes = '') {
    const { items, subtotal, totalCount } = this.getState();
    if (items.length === 0) return null;

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let msg = `🌶️ *NEW ORDER — SONAKSHI FOOD* 🌶️\n`;
    msg += `📅 *Date & Time:* ${dateStr}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Customer info
    msg += `👤 *CUSTOMER DETAILS:*\n`;
    msg += `• *Name:* ${customerDetails.name || 'Valued Customer'}\n`;
    if (customerDetails.phone) msg += `• *Phone:* ${customerDetails.phone}\n`;
    if (customerDetails.email) msg += `• *Email:* ${customerDetails.email}\n`;
    if (customerDetails.orderType) msg += `• *Order Type:* ${customerDetails.orderType}\n`;
    if (customerDetails.address) msg += `• *Delivery Address:* ${customerDetails.address}\n`;
    if (customerDetails.city) msg += `• *City / Pincode:* ${customerDetails.city} ${customerDetails.pincode ? `(${customerDetails.pincode})` : ''}\n`;

    msg += `\n🛒 *ITEMS ORDERED (${totalCount} Total Items):*\n`;
    items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      msg += `${index + 1}. *${item.name}*\n`;
      msg += `   └ Size: ${item.sizeLabel} | Qty: ${item.quantity} | ₹${item.price} = *₹${itemTotal}*\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *ORDER ESTIMATED TOTAL: ₹${subtotal}*\n`;

    if (orderNotes && orderNotes.trim()) {
      msg += `\n📝 *Special Instructions / Notes:*\n"${orderNotes.trim()}"\n`;
    }

    msg += `\n📍 *Sonakshi Food Manufacturing Unit*\n`;
    msg += `Pure Ingredients · Authentic Taste · Hygienic Craft\n`;
    msg += `Contact: +91 9234610543 | piyushk8541@gmail.com`;

    const encodedText = encodeURIComponent(msg);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
  }
}

export const cartStore = new CartStore();
