(function(){
  'use strict';
  const KEY = 'hdp_cart_count';
  const countEl = () => document.getElementById('cart-count');

  function getCount(){
    return parseInt(localStorage.getItem(KEY) || '0', 10) || 0;
  }
  function setCount(n){
    localStorage.setItem(KEY, String(n));
    if (countEl()) countEl().textContent = n;
  }

  function flash(msg){
    // tiny unobtrusive feedback
    const id = 'cart-count-flash';
    let el = document.getElementById(id);
    if (!el){ el = document.createElement('div'); el.id = id;
      el.style.position = 'fixed'; el.style.right = '18px'; el.style.bottom = '18px';
      el.style.background = 'rgba(0,0,0,0.75)'; el.style.color = '#fff'; el.style.padding = '8px 12px';
      el.style.borderRadius = '8px'; el.style.zIndex = 1200; el.style.transition = 'opacity .2s';
      document.body.appendChild(el);
    }
    el.textContent = msg; el.style.opacity = '1';
    clearTimeout(el._t); el._t = setTimeout(()=> el.style.opacity = '0', 900);
  }

  document.addEventListener('DOMContentLoaded', function(){
    // initialize visible count
    setCount(getCount());

    // increment on click of .add-to-cart
    document.body.addEventListener('click', function(e){
      const btn = e.target.closest('.add-to-cart');
      if (!btn) return;
      e.preventDefault();
      const current = getCount();
      const next = current + 1;
      setCount(next);
      flash('Added to cart');
    });
  });
})();