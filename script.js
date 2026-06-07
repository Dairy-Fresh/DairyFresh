  // ── AUTH ──────────────────────────────────────────
  // Simple in-memory user store (resets on page refresh — swap for localStorage/backend as needed)
  const users = {}; // email → { firstName, lastName, password }
  let currentUser = null;

  function openAuth(tab) {
    const overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    if (tab) switchTab(tab);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAuth() {
    const overlay = document.getElementById('authOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function handleOverlayClick(e) {
    if (e.target === document.getElementById('authOverlay')) closeAuth();
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuth(); });

  function switchTab(tab) {
    ['login','signup'].forEach(t => {
      document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1))?.classList.toggle('active', t === tab);
      document.getElementById('panel' + t.charAt(0).toUpperCase() + t.slice(1))?.classList.toggle('active', t === tab);
    });
    document.getElementById('panelSuccess')?.classList.remove('active');
    clearAuthErrors();
  }

  function clearAuthErrors() {
    ['loginError','signupError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('show'); el.textContent = ''; }
    });
    document.querySelectorAll('.auth-form input').forEach(i => i.classList.remove('error'));
  }

  function showAuthError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }

  function showAuthSuccess(title, msg) {
    ['panelLogin','panelSignup'].forEach(id => document.getElementById(id)?.classList.remove('active'));
    const panel = document.getElementById('panelSuccess');
    if (panel) panel.classList.add('active');
    const t = document.getElementById('successTitle');
    const m = document.getElementById('successMsg');
    if (t) t.textContent = title;
    if (m) m.textContent = msg;
    setTimeout(() => { closeAuth(); updateNavForUser(); }, 2200);
  }

  function handleAuthLogin() {
    clearAuthErrors();
    const email = document.getElementById('authEmail')?.value.trim();
    const password = document.getElementById('authPassword')?.value;
    if (!email) { document.getElementById('authEmail')?.classList.add('error'); showAuthError('loginError', 'Please enter your email.'); return; }
    if (!password) { document.getElementById('authPassword')?.classList.add('error'); showAuthError('loginError', 'Please enter your password.'); return; }
    if (!users[email]) { showAuthError('loginError', 'No account found with that email. Sign up first!'); return; }
    if (users[email].password !== password) { showAuthError('loginError', 'Incorrect password. Please try again.'); return; }
    currentUser = { email, ...users[email] };
    showAuthSuccess('Welcome back, ' + currentUser.firstName + '! 👋', 'You\'re now signed in to DairyFresh.');
  }

  function handleAuthSignup() {
    clearAuthErrors();
    const first = document.getElementById('signupFirst')?.value.trim();
    const last = document.getElementById('signupLast')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;
    const confirm = document.getElementById('signupConfirm')?.value;
    if (!first) { document.getElementById('signupFirst')?.classList.add('error'); showAuthError('signupError', 'Please enter your first name.'); return; }
    if (!email || !email.includes('@')) { document.getElementById('signupEmail')?.classList.add('error'); showAuthError('signupError', 'Please enter a valid email address.'); return; }
    if (users[email]) { showAuthError('signupError', 'An account with this email already exists. Try logging in.'); return; }
    if (!password || password.length < 8) { document.getElementById('signupPassword')?.classList.add('error'); showAuthError('signupError', 'Password must be at least 8 characters.'); return; }
    if (password !== confirm) { document.getElementById('signupConfirm')?.classList.add('error'); showAuthError('signupError', 'Passwords don\'t match.'); return; }
    users[email] = { firstName: first, lastName: last, password };
    currentUser = { email, firstName: first, lastName: last };
    showAuthSuccess('Welcome to DairyFresh, ' + first + '! 🎉', 'Your account is ready. Enjoy 10% off your first order.');
  }

  function updateNavForUser() {
    const btn = document.getElementById('navLoginBtn');
    if (!btn) return;
    if (currentUser) {
      btn.textContent = currentUser.firstName || 'Account';
      btn.classList.add('logged-in');
      btn.onclick = () => {
        if (confirm('Sign out of DairyFresh?')) { currentUser = null; updateNavForUser(); }
      };
    } else {
      btn.textContent = 'Login';
      btn.classList.remove('logged-in');
      btn.onclick = () => openAuth();
    }
  }
  // ──────────────────────────────────────────────────

  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });

  // Reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => obs.observe(r));

  //Menu
  function showMenu(){
   const menu = document.querySelector("nav ul")
   let display = menu.style.display
    menu.style.display = display == "flex" ? "none":"flex";
   
  }

  // Cart
  let cartCount = 0;
  function addToCart(name) {
    cartCount++;
    const toast = document.getElementById('cartToast');
    document.getElementById('cartMsg').textContent = `${name} added! (${cartCount} item${cartCount>1?'s':''})`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Subscribe
  function subscribe() {
    const input = document.getElementById('emailInput');
    if (!input.value || !input.value.includes('@')) {
      input.style.borderColor = '#e05c5c'; 
      setTimeout(() => input.style.borderColor = '', 1200);
      return;
    }
    input.style.borderColor = '#6abf69';
    input.value = '✓ Subscribed! Welcome to DairyFresh.';
    input.disabled = true;
  }

  function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    alert('Login successful! Welcome back to DairyFresh.');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
  }

  // Staggered product reveals
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
