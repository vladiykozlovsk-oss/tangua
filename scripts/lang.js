(function () {
  const SUPPORTED_LANGS = ['en', 'pl', 'cs'];
  const STORAGE_KEY = 'tangua-language';
  const translationNode = document.getElementById('page-translations');
  let translations = {};

  if (translationNode) {
    try {
      translations = JSON.parse(translationNode.textContent.trim());
    } catch (error) {
      console.error('Unable to parse translations', error);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  let activeLang = SUPPORTED_LANGS.includes(stored) ? stored : 'en';

  const getLangData = (lang) => translations[lang] || translations.en || {};

  const resolveKey = (lang, key) => {
    const langData = getLangData(lang);
    const parts = key.split('.');
    let value = langData;

    for (const part of parts) {
      if (value && Object.prototype.hasOwnProperty.call(value, part)) {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined && lang !== 'en') {
      return resolveKey('en', key);
    }

    return value ?? '';
  };

  const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      const translated = resolveKey(activeLang, key);
      if (node.dataset.i18nHtml === 'true') {
        node.innerHTML = translated;
      } else {
        node.textContent = translated;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      node.setAttribute('placeholder', resolveKey(activeLang, key));
    });

    document.querySelectorAll('[data-i18n-label]').forEach((node) => {
      const key = node.getAttribute('data-i18n-label');
      node.setAttribute('aria-label', resolveKey(activeLang, key));
    });

    const titleKey = document.body.getAttribute('data-i18n-title');
    if (titleKey) {
      const translatedTitle = resolveKey(activeLang, titleKey);
      if (translatedTitle) {
        document.title = translatedTitle;
      }
    }

    document.documentElement.lang = activeLang;
  };

  const updateButtons = () => {
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const lang = button.getAttribute('data-lang');
      button.setAttribute('aria-pressed', String(lang === activeLang));
    });
  };

  const setLanguage = (lang) => {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    activeLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
    updateButtons();
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lang]');
    if (!trigger) return;
    event.preventDefault();
    setLanguage(trigger.getAttribute('data-lang'));
  });

  window.addEventListener('pageshow', () => {
    const storedLang = localStorage.getItem(STORAGE_KEY);
    if (storedLang && SUPPORTED_LANGS.includes(storedLang) && storedLang !== activeLang) {
      activeLang = storedLang;
      applyTranslations();
      updateButtons();
    }
  });

  applyTranslations();
  updateButtons();
})();
