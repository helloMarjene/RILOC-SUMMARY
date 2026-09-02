/* RILOC Enhanced — Interactive Features */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     MOBILE NAVIGATION
     ============================================ */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a:not(.btn-donate)').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================
     NAVBAR SCROLL EFFECT (Glass → Solid)
     ============================================ */
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if(currentScroll > 60){
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  /* ============================================
     SMOOTH SCROLL (with offset for fixed nav)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     SCROLL-TRIGGERED REVEAL ANIMATIONS
     ============================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        // Optional: stop observing once revealed
        // revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================
     DONATE MODAL
     ============================================ */
  const modal = document.getElementById('donateModal');
  const openBtns = document.querySelectorAll('[data-open-donate]');
  const closeBtn = document.querySelector('[data-close-donate]');

  if(modal){
    openBtns.forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }));

    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if(closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if(e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.classList.contains('open')) close(); });
  }

  /* ============================================
     DONATE FORM → WHATSAPP INTEGRATION
     ============================================ */
  const donateForm = document.getElementById('donateForm');
  if(donateForm){
    donateForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(donateForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const amount = formData.get('amount') || '';
      const currency = formData.get('currency') || 'USD';
      const message = formData.get('message') || '';

      if(!name || !amount){
        alert('Please fill in your name and donation amount.');
        return;
      }

      const whatsappNumber = '13364867133'; // RILOC phone number (digits only)

      const text = `*New Donation Request for RILOC* %0A%0A` +
        `*Name:* ${name}%0A` +
        `*Email:* ${email}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Amount:* ${currency} ${amount}%0A` +
        `${message ? '*Message:* ' + message + '%0A' : ''}%0A` +
        `This person wants to donate ${currency} ${amount} to RILOC. Please follow up.`;

      // Close modal
      if(modal) modal.classList.remove('open');
      document.body.style.overflow = '';

      // Open WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');

      // Reset form
      donateForm.reset();
    });
  }

  /* ============================================
     ACTIVE NAV LINK HIGHLIGHTING
     ============================================ */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === current || (current === '' && href === 'index.html')){
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  /* ============================================
     PARALLAX HERO EFFECT (subtle)
     ============================================ */
  const heroes = document.querySelectorAll('.hero, .page-header');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    heroes.forEach(hero => {
      const rect = hero.getBoundingClientRect();
      if(rect.bottom > 0 && rect.top < window.innerHeight){
        const speed = 0.4;
        const yPos = -(scrollY * speed);
        const before = hero.querySelector('::before');
        // We can't directly style pseudo-elements via JS, 
        // so we use a CSS custom property if needed, or skip for simplicity
      }
    });
  });

  /* ============================================
     COUNTER ANIMATION (for impact numbers)
     ============================================ */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if(current >= target){
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString();
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============================================
     IMAGE SLIDER CONTROLS (if present)
     ============================================ */
  const sliders = document.querySelectorAll('.image-slider');
  sliders.forEach(slider => {
    const track = slider.querySelector('.slider-track');
    const prev = slider.querySelector('.slider-prev');
    const next = slider.querySelector('.slider-next');
    if(!track) return;

    let scrollAmount = 0;
    const slideWidth = 400;

    if(next){
      next.addEventListener('click', () => {
        track.scrollBy({ left: slideWidth, behavior: 'smooth' });
      });
    }
    if(prev){
      prev.addEventListener('click', () => {
        track.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      });
    }
  });

  /* ============================================
     GALLERY LIGHTBOX (simple)
     ============================================ */
  const galleryFrames = document.querySelectorAll('.gallery-frame');
  galleryFrames.forEach(frame => {
    frame.addEventListener('click', () => {
      const img = frame.querySelector('img');
      if(!img) return;
      // Simple lightbox could be added here
      // For now, we'll just add a subtle click feedback
      frame.style.transform = 'scale(0.98)';
      setTimeout(() => frame.style.transform = '', 150);
    });
  });

  console.log('RILOC Enhanced loaded successfully!');
});