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
