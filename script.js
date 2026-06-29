// ─── NAV SCROLL EFFECT ──────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── FADE-UP ON SCROLL (INTERSECTION OBSERVER) ─────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-up-delay').forEach(el => {
  fadeObserver.observe(el);
});

// ─── STATS COUNTER ANIMATION ────────────────────────────────────────────
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const isLarge = target >= 100;

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = isLarge ? current.toLocaleString() : current;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isLarge ? target.toLocaleString() : target;
  };
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const valueEl = entry.target.querySelector('.stat-value');
      if (valueEl && !valueEl.dataset.animated) {
        valueEl.dataset.animated = 'true';
        const target = parseInt(valueEl.dataset.target, 10);
        animateCounter(valueEl, target);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));

// ─── SMOOTH SCROLL FOR NAV LINKS ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── CARD CAROUSEL PULSE ─────────────────────────────────────────────────
// Cycles the "Best" badge through the cards to show AI selection in action
const cards = document.querySelectorAll('.card-item');
const labels = ['4x points', '3x points', '2x points'];
const names = ['Amex Gold', 'Chase Sapphire', 'Citi Double Cash'];
let active = 0;

function cycleCards() {
  cards.forEach((card, i) => {
    card.classList.remove('card-best', 'card-second', 'card-third');
    const badge = card.querySelector('.card-badge');
    const rate = card.querySelector('.card-rate');
    const name = card.querySelector('.card-name');
    if (badge) badge.remove();

    if (i === active) {
      card.classList.add('card-best');
      const b = document.createElement('div');
      b.className = 'card-badge';
      b.textContent = 'Best';
      card.appendChild(b);
    } else if (i === (active + 1) % 3) {
      card.classList.add('card-second');
    } else {
      card.classList.add('card-third');
    }

    if (rate) rate.textContent = labels[(i - active + 3) % 3 === 0 ? 0 : (i - active + 3) % 3 === 1 ? 1 : 2];
    if (name) name.textContent = names[i];
  });

  active = (active + 1) % 3;
}

setInterval(cycleCards, 3000);

// ─── PARALLAX BLOBS ──────────────────────────────────────────────────────
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

let rafId;
function updateBlobs() {
  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((blob, i) => {
    const factor = (i + 1) * 12;
    blob.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
  });
  rafId = requestAnimationFrame(updateBlobs);
}
updateBlobs();
