(function () {
  'use strict';

  const CART_KEY = 'hdp_cart_count';

  function showAlert(message) {
    alert(message);
  }

  function query(id) {
    return document.getElementById(id);
  }

  function initHeroAnimation() {
    const hero = document.querySelector('.hero-center');
    if (!hero) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      hero.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          hero.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(hero);
  }

  function initNewsletter() {
    const form = query('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = query('newsletter-email');
      const consent = query('newsletter-consent');

      if (!email || !email.value.trim() || !email.value.includes('@')) {
        if (email) email.focus();
        showAlert('Please enter a valid email address.');
        return;
      }

      if (!consent || !consent.checked) {
        showAlert('Please agree to receive emails.');
        return;
      }

      showAlert('Thanks! You are subscribed.');
      form.reset();
    });
  }

  function togglePassword(fieldId) {
    const input = query(fieldId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  function initAuthForms() {
    const signupForm = query('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const password = signupForm.querySelector('#password').value;
        const confirm = signupForm.querySelector('#confirm').value;

        if (password !== confirm) {
          showAlert('Passwords do not match');
          return;
        }

        showAlert('Static demo — implement backend signup.');
        signupForm.reset();
      });
    }

    const loginForm = query('loginForm');
    if (loginForm) {
      const toggleBtn = query('togglePwd');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
          togglePassword('password');
        });
      }

      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = loginForm.querySelector('#email').value.trim();
        if (!email) {
          showAlert('Please provide an email.');
          return;
        }

        showAlert('Static demo — implement backend login.');
        loginForm.reset();
      });
    }
  }

  function getCartCount() {
    return parseInt(localStorage.getItem(CART_KEY) || '0', 10) || 0;
  }

  function setCartCount(count) {
    localStorage.setItem(CART_KEY, String(count));
    const countEl = query('cart-count');
    if (countEl) {
      countEl.textContent = count;
    }
  }

  function flashMessage(message) {
    const id = 'cart-count-flash';
    let flashEl = document.getElementById(id);

    if (!flashEl) {
      flashEl = document.createElement('div');
      flashEl.id = id;
      flashEl.style.position = 'fixed';
      flashEl.style.right = '18px';
      flashEl.style.bottom = '18px';
      flashEl.style.background = 'rgba(0,0,0,0.75)';
      flashEl.style.color = '#fff';
      flashEl.style.padding = '8px 12px';
      flashEl.style.borderRadius = '8px';
      flashEl.style.zIndex = '1200';
      flashEl.style.transition = 'opacity .2s';
      document.body.appendChild(flashEl);
    }

    flashEl.textContent = message;
    flashEl.style.opacity = '1';
    clearTimeout(flashEl._timer);
    flashEl._timer = setTimeout(function () {
      flashEl.style.opacity = '0';
    }, 900);
  }

  function initCartCount() {
    const count = getCartCount();
    setCartCount(count);

    document.body.addEventListener('click', function (event) {
      const button = event.target.closest('.add-to-cart');
      if (!button) return;

      event.preventDefault();
      const current = getCartCount();
      const next = current + 1;
      setCartCount(next);
      flashMessage('Added to cart');
    });
  }

  function initMenuKeyboard() {
    const menu = document.querySelector('.menu-wrap');
    if (!menu) return;

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        window.location.href = '../index.html';
      }
    });

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusable = Array.from(menu.querySelectorAll(focusableSelectors));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    menu.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    first.focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeroAnimation();
    initNewsletter();
    initAuthForms();
    initCartCount();
    initMenuKeyboard();
  });
})();
