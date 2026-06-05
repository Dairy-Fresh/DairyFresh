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

  // Staggered product reveals
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
