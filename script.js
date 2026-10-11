(() => {
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dotsWrap = document.getElementById('slideDots');
  const current = document.getElementById('slideCurrent');
  const pause = document.getElementById('slidePause');
  let active = 0, paused = false, timer;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.setAttribute('aria-label', `Show photo ${i + 1}`);
    dot.addEventListener('click', () => showSlide(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];
  function showSlide(i, userAction=false) {
    active = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === active));
    dots.forEach((d, n) => { d.classList.toggle('active', n === active); d.setAttribute('aria-current', n === active ? 'true' : 'false'); });
    current.textContent = String(active + 1).padStart(2, '0');
    if (userAction && !paused) restart();
  }
  function restart(){ clearInterval(timer); timer = setInterval(() => showSlide(active + 1), 3000); }
  pause.addEventListener('click', () => {
    paused = !paused; pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    if (paused) clearInterval(timer); else restart();
  });
  showSlide(0); restart();

  const langButton = document.getElementById('langToggle');
  let lang = 'en';
  function setLang(next) {
    lang = next; document.documentElement.lang = next;
    document.querySelectorAll('[data-en][data-gu]').forEach(el => {
      const value = el.dataset[next];
      if (value !== undefined) el.innerHTML = value;
    });
    langButton.textContent = next === 'en' ? 'ગુજરાતી' : 'English';
  }
  langButton.addEventListener('click', () => setLang(lang === 'en' ? 'gu' : 'en'));

  const themeButton = document.getElementById('themeToggle');
  themeButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeButton.textContent = isDark ? '☀' : '☾';
    themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
  const menuButton = document.getElementById('mobileMenu');
  const nav = document.getElementById('mainNav');
  menuButton.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    nav.querySelectorAll('a').forEach(link => link.classList.remove('active'));
    a.classList.add('active');
  }));
  // Stay section: alternate between the outdoor area and a room preview.
  const staySlides = [...document.querySelectorAll('.stay-slide')];
  const stayDots = [...document.querySelectorAll('.stay-dot')];
  if (staySlides.length > 1) {
    let stayIndex = 0;
    const showStaySlide = (index) => {
      stayIndex = index;
      staySlides.forEach((slide, i) => slide.classList.toggle('active', i === stayIndex));
      stayDots.forEach((dot, i) => dot.classList.toggle('active', i === stayIndex));
    };
    stayDots.forEach((dot, i) => dot.addEventListener('click', () => showStaySlide(i)));
    window.setInterval(() => showStaySlide((stayIndex + 1) % staySlides.length), 2000);
  }

  const travelForm = document.getElementById('travelEnquiryForm');
  if (travelForm) {
    const dateField = travelForm.querySelector('[name="travelDate"]');
    dateField.min = new Date().toISOString().slice(0, 10);
    travelForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const d = new FormData(travelForm);
      const message = [
        'Hello The Dang Greenery, I would like to enquire about taxi/travel services in Dang.',
        `Name: ${d.get('customerName')}`,
        `Mobile: ${d.get('mobile')}`,
        `Travel date: ${d.get('travelDate')}`,
        `Pickup: ${d.get('pickup')}`,
        `Passengers: ${d.get('passengers')}`,
        `Vehicle: ${d.get('vehicle')}`,
        `Places to visit: ${d.get('places') || 'Not specified'}`,
        `Pickup/drop requirements: ${d.get('requirements') || 'Not specified'}`,
        'Please share availability and confirmed fare. I understand this is an enquiry, not a confirmed booking.'
      ].join('\n');
      window.open(`https://wa.me/916206391340?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  const lightbox = document.getElementById('lightbox'), lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.full; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
  }));
  function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImg.src='';}
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
})();