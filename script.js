/* Portfolio interactions: mobile nav, theme, language, filters, animation, contact */
(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const readPref = (name, fallback) => { try { return localStorage.getItem(name) || fallback; } catch { return fallback; } };
  const savePref = (name, value) => { try { localStorage.setItem(name, value); } catch {} };

  /* Preloader: never block interactions if a resource fails or is slow. */
  const hidePreloader = () => { const preloader = $('#preloader'); if (preloader) preloader.classList.add('hide'); };
  if (document.readyState === 'complete') hidePreloader();
  else window.addEventListener('load', hidePreloader, { once:true });
  setTimeout(hidePreloader, 1400);

  /* Theme is persistent across all portfolio pages. */
  const themeButton = $('#themeToggle');
  function setTheme(theme) {
    const dark = theme === 'dark';
    document.body.classList.toggle('dark-mode', dark);
    if (themeButton) {
      themeButton.innerHTML = dark ? '<i class="bi bi-sun" aria-hidden="true"></i>' : '<i class="bi bi-moon-stars" aria-hidden="true"></i>';
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton.title = dark ? 'Light mode' : 'Dark mode';
    }
    savePref('josia-theme', theme);
  }
  setTheme(readPref('josia-theme', 'light'));
  themeButton?.addEventListener('click', () => setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark'));

  /* Language selection with keyboard/outside-click closing. */
  const languageDropdown = $('.lang-dropdown');
  const languageButton = $('.lang-btn');
  const languageOptions = $$('.lang-option');
  function closeLanguageMenu() {
    languageDropdown?.classList.remove('active');
    languageButton?.setAttribute('aria-expanded', 'false');
  }
  function setLanguage(value) {
    const lang = value === 'id' ? 'id' : 'en';
    document.body.classList.toggle('lang-indonesia', lang === 'id');
    document.documentElement.lang = lang;
    const label = $('.current-lang'); if (label) label.textContent = lang.toUpperCase();
    languageOptions.forEach(button => {
      const active = button.dataset.lang === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    savePref('portfolio-lang', lang);
  }
  setLanguage(readPref('portfolio-lang', 'en'));
  languageButton?.addEventListener('click', event => {
    event.stopPropagation();
    const active = languageDropdown.classList.toggle('active');
    languageButton.setAttribute('aria-expanded', String(active));
  });
  languageOptions.forEach(button => button.addEventListener('click', () => { setLanguage(button.dataset.lang); closeLanguageMenu(); }));
  document.addEventListener('click', event => { if (languageDropdown && !languageDropdown.contains(event.target)) closeLanguageMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeLanguageMenu();
      if (mobileMenu?.classList.contains('show')) closeMobileMenu();
    }
  });

  /* Native mobile menu: fully functional with or without Bootstrap JS. */
  const mobileMenu = $('#mainNav');
  const menuButton = $('.navbar-toggler');
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('show');
    menuButton?.setAttribute('aria-expanded', 'false');
    closeLanguageMenu();
  }
  if (mobileMenu && menuButton) {
    menuButton.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('show');
      menuButton.setAttribute('aria-expanded', String(open));
      if (!open) closeLanguageMenu();
    });
    $$('.nav-link', mobileMenu).forEach(link => link.addEventListener('click', closeMobileMenu));
    window.addEventListener('resize', () => { if (window.innerWidth >= 992) closeMobileMenu(); }, { passive:true });
    document.addEventListener('click', event => {
      if (window.innerWidth < 992 && mobileMenu.classList.contains('show') && !mobileMenu.contains(event.target) && !menuButton.contains(event.target)) closeMobileMenu();
    });
  }

  /* Project filters: manage state and keyboard-accessible button selection. */
  const filterButtons = $$('.project-filter');
  const projectCards = $$('.project-card[data-category]');
  const emptyText = $('#projectEmpty');
  function filterProjects(category) {
    let visible = 0;
    projectCards.forEach(card => {
      const matches = category === 'all' || card.dataset.category === category;
      card.hidden = !matches;
      if (matches) visible++;
    });
    filterButtons.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (emptyText) emptyText.hidden = visible > 0;
  }
  filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));

  /* Progressive enhancements: respect reduced motion and unsupported browsers. */
  const revealElements = $$('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold:0.06, rootMargin:'0px 0px 55px 0px' });
    revealElements.forEach(element => observer.observe(element));
  } else revealElements.forEach(element => element.classList.add('visible'));

  if (!reducedMotion) {
    $$('.typewrite').forEach(element => {
      let options;
      try { options = JSON.parse(element.dataset.type || '[]'); } catch { options = []; }
      if (!options.length) return;
      const words = options.filter(word => typeof word === 'string');
      if (!words.length) return;
      let index = 0, length = 0, deleting = false;
      const tick = () => {
        // Preserve plain text only; no HTML injection from data attributes.
        const word = words[index % words.length];
        length += deleting ? -1 : 1;
        element.textContent = word.slice(0, length);
        let wait = deleting ? 45 : 70;
        if (!deleting && length >= word.length) { deleting = true; wait = 1700; }
        else if (deleting && length === 0) { deleting = false; index++; wait = 400; }
        setTimeout(tick, wait);
      };
      tick();
    });
  } else {
    $$('.typewrite').forEach(element => {
      try { element.textContent = JSON.parse(element.dataset.type || '[]')[0] || ''; } catch { element.textContent = ''; }
    });
  }

  const navbar = $('#navbar');
  const progressBar = $('#scrollProgress');
  const backTop = $('#backTop');
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link[href^="#"]');
  let scrollScheduled = false;
  function updateOnScroll() {
    const scrollY = window.scrollY;
    navbar?.classList.toggle('scrolled', scrollY > 24);
    backTop?.classList.toggle('show', scrollY > 500);
    if (progressBar) {
      const denominator = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progressBar.style.width = Math.min(100, Math.max(0, scrollY / denominator * 100)) + '%';
    }
    if (navLinks.length && sections.length) {
      let activeId = 'home';
      sections.forEach(section => { if (section.getBoundingClientRect().top <= 160) activeId = section.id; });
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + activeId));
    }
    scrollScheduled = false;
  }
  window.addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateOnScroll); } }, { passive:true });
  window.addEventListener('resize', updateOnScroll, { passive:true });
  updateOnScroll();
  backTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:reducedMotion?'auto':'smooth' }));

  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target, target = Number(el.dataset.count) || 0;
        if (reducedMotion) el.textContent = '+' + target;
        else {
          const start = performance.now();
          const run = now => {
            const ratio = Math.min(1, (now - start) / 850);
            el.textContent = '+' + Math.round(target * (1 - Math.pow(1-ratio,3)));
            if (ratio < 1) requestAnimationFrame(run);
          };
          requestAnimationFrame(run);
        }
        counterObserver.unobserve(el);
      });
    }, { threshold:.35 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* Contact message: encode the whole message exactly once. */
  $('#contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = $('#name')?.value.trim() || '';
    const email = $('#email')?.value.trim() || '';
    const message = $('#message')?.value.trim() || '';
    if (!name || !email || !message) return;
    const text = `Halo Josia,\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`;
    const url = 'https://wa.me/6281241776292?text=' + encodeURIComponent(text);
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else window.location.assign(url);
  });
})();
