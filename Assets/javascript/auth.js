(function () {
  'use strict';

  function show(message) {
    alert(message);
  }

  function togglePassword(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.type = el.type === 'password' ? 'text' : 'password';
  }

  function initSignup() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const pwd = form.querySelector('#password').value;
      const confirm = form.querySelector('#confirm').value;
      if (pwd !== confirm) {
        show('Passwords do not match');
        return;
      }
      show('Static demo — implement backend signup.');
      form.reset();
    });
  }

  function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const toggle = document.getElementById('togglePwd');
    if (toggle) {
      toggle.addEventListener('click', function () { togglePassword('password'); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = form.querySelector('#email').value.trim();
      if (!email) {
        show('Please provide an email.');
        return;
      }
      show('Static demo — implement backend login.');
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSignup();
    initLogin();
  });
})();