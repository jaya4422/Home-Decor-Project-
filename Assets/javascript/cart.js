(function () {
  'use strict';

  const STORAGE_KEY = 'hdp_cart_v1';

  function cents(n) { return Math.round(Number(n) * 100); }
  function fmt(c) { return (c/100).toFixed(2); }

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

  function totalQty(cart) { return cart.reduce((s,i)=>s+i.qty,0); }

  function updateCount(cart) {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = totalQty(cart);
  }

  function createCartDrawer() {
    let drawer = document.getElementById('cart-drawer');
    if (drawer) return drawer;

    drawer = document.createElement('aside');
    drawer.id = 'cart-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="cart-inner">
        <h3>Your cart</h3>
        <div class="cart-items"></div>
        <div class="cart-footer">
          <div class="total">Total: $<span class="total-amount">0.00</span></div>
          <div style="margin-top:8px; text-align:right;">
            <button class="clear-cart">Clear</button>
            <button class="checkout">Checkout</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(drawer);

    drawer.addEventListener('click', (e) => {
      if (e.target.matches('.clear-cart')) {
        saveCart([]);
        renderCart([]);
      }
      if (e.target.matches('.checkout')) {
        alert('This is a demo — integrate a real checkout.');
      }
      if (e.target.matches('.remove')) {
        const idx = Number(e.target.dataset.index);
        const cart = loadCart();
        cart.splice(idx,1);
        saveCart(cart);
        renderCart(cart);
      }
    });

    return drawer;
  }

  function renderCart(cart) {
    const drawer = createCartDrawer();
    const itemsEl = drawer.querySelector('.cart-items');
    itemsEl.innerHTML = '';

    const total = cart.reduce((s,i)=>s + i.qty * i.priceCents, 0);

    cart.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'item';
      row.innerHTML = `
        <div class="left">
          <div class="name">${escapeHtml(item.name)}</div>
          <div class="meta">${item.qty} × $${fmt(item.priceCents)}</div>
        </div>
        <div class="right">
          <div class="subtotal">$${fmt(item.qty * item.priceCents)}</div>
          <button class="remove" data-index="${idx}" aria-label="Remove">Remove</button>
        </div>`;
      itemsEl.appendChild(row);
    });

    drawer.querySelector('.total-amount').textContent = fmt(total);
    updateCount(cart);
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"})[c]; }); }

  function addItem(name, price) {
    const cart = loadCart();
    const priceCents = cents(price);
    const idx = cart.findIndex(i => i.name === name && i.priceCents === priceCents);
    if (idx >= 0) {
      cart[idx].qty += 1;
    } else {
      cart.push({ name, priceCents, qty: 1 });
    }
    saveCart(cart);
    renderCart(cart);
    // quick feedback
    flashMessage(`${name} added to cart`);
  }

  function flashMessage(msg) {
    const id = 'cart-msg';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.style.position = 'fixed';
      el.style.right = '20px';
      el.style.bottom = '20px';
      el.style.background = 'rgba(0,0,0,0.8)';
      el.style.color = '#fff';
      el.style.padding = '10px 14px';
      el.style.borderRadius = '8px';
      el.style.zIndex = 1200;
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(()=> el.style.opacity = '0', 1200);
  }

  function init() {
    const drawer = createCartDrawer();
    const cart = loadCart();
    renderCart(cart);

    // Toggle drawer
    const toggle = document.getElementById('cart-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        drawer.classList.toggle('open');
        const isOpen = drawer.classList.contains('open');
        drawer.setAttribute('aria-hidden', !isOpen);
      });
    }

    // Add-to-cart buttons
    document.body.addEventListener('click', (e) => {
      if (e.target.matches('.add-to-cart')) {
        const name = e.target.dataset.name || (e.target.closest('.product-card') && e.target.closest('.product-card').querySelector('.product-title')?.textContent.trim());
        const price = e.target.dataset.price || (e.target.closest('.product-card') && e.target.closest('.product-card').querySelector('.product-price')?.textContent.replace(/[^0-9\.]/g, ''));
        if (!name || !price) return;
        addItem(name, price);
      }
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (!document.getElementById('cart-drawer').contains(e.target) && !document.getElementById('cart-toggle').contains(e.target)) {
        document.getElementById('cart-drawer').classList.remove('open');
      }
    });
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();