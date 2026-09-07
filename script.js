const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

if (!reduced) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const amount = card.classList.contains('hero-image-wrap') ? 4 : 7;
      card.style.transform = `perspective(900px) rotateX(${-y * amount}deg) rotateY(${x * amount}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = card.classList.contains('hero-image-wrap') ? 'rotate(3deg)' : '';
    });
  });

  const heroVisual = document.querySelector('.hero-visual');
  heroVisual?.addEventListener('pointermove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.querySelectorAll('.orb, .floating-chip').forEach((el, index) => {
      el.style.translate = `${x * (index + 1) * 12}px ${y * (index + 1) * 10}px`;
    });
  });
}

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Thanks — your enquiry is ready to be picked up by the Sonakshi team.';
  event.currentTarget.reset();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
});
