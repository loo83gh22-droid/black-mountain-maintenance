// =============================================
// BLACK MOUNTAIN MAINTENANCE — SITE SCRIPTS
// =============================================

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Scroll reveal via IntersectionObserver (respects reduced-motion)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  // Stagger items that share a parent for a subtle cascade
  const groups = new Map();
  revealEls.forEach(el => {
    const parent = el.parentElement;
    const idx = groups.get(parent) || 0;
    el.style.setProperty('--reveal-delay', (idx * 0.08) + 's');
    groups.set(parent, idx + 1);
    revealObserver.observe(el);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Mobile nav hamburger
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileNavClose = document.getElementById('mobile-nav-close');

function openMobileNav() {
  hamburger.classList.add('is-open');
  mobileNav.classList.add('is-open');
  mobileNavOverlay.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  hamburger.classList.remove('is-open');
  mobileNav.classList.remove('is-open');
  mobileNavOverlay.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMobileNav);
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

document.querySelectorAll('.mobile-nav-links a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Quote form: pre-select property type from ?type=, validate, submit to Web3Forms
const form = document.getElementById('contact-form');
if (form) {
  const typeParam = new URLSearchParams(window.location.search).get('type');
  const typeSelect = form.querySelector('#property_type');
  if (typeParam && typeSelect) {
    const match = [...typeSelect.options].find(o => o.value.toLowerCase() === typeParam.toLowerCase());
    if (match) typeSelect.value = match.value;
  }

  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');
  const btn = form.querySelector('.form-submit');
  const btnLabel = btn.textContent;

  function showError(message, field) {
    error.textContent = message;
    error.hidden = false;
    if (field) field.focus();
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    error.hidden = true;

    // Trim, then check required fields and email format before sending
    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea')
      .forEach(el => { el.value = el.value.trim(); });
    const missing = [...form.querySelectorAll('[required]')].find(el => !el.value);
    if (missing) {
      const label = form.querySelector(`label[for="${missing.id}"]`);
      return showError(`Please fill in ${label ? label.textContent.toLowerCase() : 'all required fields'}.`, missing);
    }
    const email = form.querySelector('#email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      return showError('Please check your email address.', email);
    }

    // Web3Forms keeps only one value per field name, so join the checkboxes
    form.querySelector('#services-summary').value =
      [...form.querySelectorAll('input[name="service_option"]:checked')].map(el => el.value).join(', ') || 'Not specified';

    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const data = new FormData(form);
      data.delete('service_option');
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      form.reset();
      success.style.display = 'flex';
      btn.style.display = 'none';
    } catch {
      btn.textContent = btnLabel;
      btn.disabled = false;
      showError('Something went wrong sending that. Please try again, or call us instead.');
    }
  });
}
