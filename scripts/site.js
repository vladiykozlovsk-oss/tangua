(function () {
  const animated = Array.from(document.querySelectorAll('[data-animate]'));
  if (!animated.length) return;

  const reveal = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(reveal, {
    root: null,
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  animated.forEach((el) => observer.observe(el));
})();

(function () {
  const headerBar = document.querySelector('.site-header__bar');
  const toggle = headerBar?.querySelector('.nav-toggle');
  const nav = headerBar?.querySelector('.nav');
  if (!headerBar || !toggle || !nav) return;

  const mobileQuery = window.matchMedia('(max-width: 899px)');

  const syncAria = () => {
    if (!mobileQuery.matches) {
      nav.removeAttribute('aria-hidden');
      return;
    }

    const expanded = headerBar.classList.contains('is-open');
    nav.setAttribute('aria-hidden', expanded ? 'false' : 'true');
  };

  const closeNav = () => {
    if (!headerBar.classList.contains('is-open')) return;
    headerBar.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    syncAria();
  };

  const openNav = () => {
    if (headerBar.classList.contains('is-open')) return;
    headerBar.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    syncAria();
  };

  const handleToggle = () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeNav();
    } else {
      openNav();
    }
  };

  toggle.addEventListener('click', handleToggle);

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileQuery.matches) {
        closeNav();
      }
    });
  });

  nav.querySelectorAll('.language-toggle__button').forEach((button) => {
    button.addEventListener('click', () => {
      if (mobileQuery.matches) {
        closeNav();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!mobileQuery.matches) return;
    if (!headerBar.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
    }
  });

  mobileQuery.addEventListener('change', () => {
    if (!mobileQuery.matches) {
      closeNav();
    }
    syncAria();
  });

  syncAria();
})();

(function () {
  const carousels = Array.from(document.querySelectorAll('[data-carousel]'));
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('[data-carousel-track]');
    if (!track) return;

    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');

    const updateButtons = () => {
      const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
      const tolerance = 8;

      if (prev) {
        prev.disabled = track.scrollLeft <= tolerance;
      }

      if (next) {
        next.disabled = track.scrollLeft >= maxScroll - tolerance;
      }
    };

    const scrollByAmount = (direction) => {
      const amount = track.clientWidth * 0.9 * direction;
      track.scrollBy({ left: amount, behavior: 'smooth' });
    };

    if (prev) {
      prev.addEventListener('click', () => scrollByAmount(-1));
    }

    if (next) {
      next.addEventListener('click', () => scrollByAmount(1));
    }

    let rafId = 0;
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateButtons);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(updateButtons));

    updateButtons();
  });
})();
