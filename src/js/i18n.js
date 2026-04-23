// ...existing code...
export async function initI18n(defaultLang = 'en') {
  const supported = ['en','es','ht','fr'];
  const stored = localStorage.getItem('kc_lang');
  const lang = stored || defaultLang;
  await loadLanguage(lang);
  return { setLanguage, getLanguage, supported };
}

let currentDict = {};
let currentLang = 'en';

async function fetchDict(lang) {
  const url = new URL(`../i18n/${lang}.json`, import.meta.url).href;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load dict: ' + p);
  return await res.json();
}

export async function loadLanguage(lang) {
  if (!lang) lang = 'en';
  if (lang === currentLang && Object.keys(currentDict).length) return;
  currentDict = await fetchDict(lang);
  currentLang = lang;
  localStorage.setItem('kc_lang', lang);
  applyTranslations(document);
}

export function setLanguage(lang) { return loadLanguage(lang); }
export function getLanguage() { return currentLang; }

export function t(key) { return currentDict[key] ?? key; }

export function applyTranslations(root = document) {
  // attributes: data-i18n => text content, data-i18n-alt => alt, data-i18n-placeholder => placeholder
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const txt = t(el.getAttribute('data-i18n'));
    if (txt !== undefined) el.textContent = txt;
  });
  root.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const txt = t(el.getAttribute('data-i18n-alt'));
    if (txt !== undefined) el.setAttribute('alt', txt);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const txt = t(el.getAttribute('data-i18n-placeholder'));
    if (txt !== undefined) el.setAttribute('placeholder', txt);
  });

  // page-level meta updates (title + meta description)
  const titleEl = document.querySelector('title[data-i18n]');
  if (titleEl) {
    const val = t(titleEl.getAttribute('data-i18n'));
    if (val) document.title = val;
  }
  const metaDesc = document.querySelector('meta[name="description"][data-i18n]');
  if (metaDesc) {
    const val = t(metaDesc.getAttribute('data-i18n'));
    if (val) metaDesc.setAttribute('content', val);
  }
}