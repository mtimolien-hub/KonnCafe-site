import { initI18n, applyTranslations } from '../js/i18n.js';
import { initGame } from '../js/game.js';

export async function initMain() {
  // init i18n (safe even if no i18n attributes present)
  const i18n = await initI18n('en');
  applyTranslations(document);

  // language toggle (guarded)
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-lang]');
      if(!btn) return;
      const lang = btn.getAttribute('data-lang');
      document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      await i18n.setLanguage(lang);
      applyTranslations(document);
    });
  }

  // mobile drawer (guarded)
  const drawer = document.getElementById('drawer');
  const btnMenu = document.getElementById('btn-menu');
  const btnDrawerClose = document.getElementById('btn-drawer-close');
  if (btnMenu && drawer) {
    btnMenu.addEventListener('click', ()=> { drawer.classList.remove('translate-x-full'); drawer.style.transform = 'translateX(0)'; });
  }
  if (btnDrawerClose && drawer) {
    btnDrawerClose.addEventListener('click', ()=> { drawer.style.transform = ''; drawer.classList.add('translate-x-full'); });
  }

  // reveal observer (only if elements exist)
  const revealEls = document.querySelectorAll('.reveal-section');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('shown'); o.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => obs.observe(el));
  }

  // tabs (guarded)
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const t = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(c=>c.classList.add('hidden'));
        const tab = document.getElementById('tab-'+t);
        if (tab) tab.classList.remove('hidden');
      });
    });
  }

  // Order Modal wiring (guarded)
  const orderModal = document.getElementById('orderModal');
  const btnShop = document.getElementById('btn-shop');
  const btnShopHero = document.getElementById('btn-shop-hero');
  const orderClose = document.getElementById('order-close');
  function openOrder(){ if(orderModal){ orderModal.classList.remove('hidden'); orderModal.classList.add('flex'); } }
  function closeOrder(){ if(orderModal){ orderModal.classList.remove('flex'); orderModal.classList.add('hidden'); } }
  if (btnShop) btnShop.addEventListener('click', ()=> openOrder());
  if (btnShopHero) btnShopHero.addEventListener('click', ()=> openOrder());
  if (orderClose) orderClose.addEventListener('click', ()=> closeOrder());

  // wire i18n placeholders after translations applied
  applyTranslations(document);

  // init Game only if canvas exists
  let game = null;
  const snakeCanvas = document.getElementById('snake-canvas');
  if (snakeCanvas) {
    game = initGame({});
  }

  // start button safe listener
  const startBtn = document.getElementById('btn-start-game');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // game module handles start
    });
  }

  // Observe game overlay (guarded)
  const gameOverlay = document.getElementById('game-overlay');
  if (gameOverlay && game) {
    const mo = new MutationObserver(() => {
      const hidden = gameOverlay.classList.contains('hidden');
      if(hidden) game.pause();
      else game.resume();
    });
    mo.observe(gameOverlay, { attributes: true, attributeFilter: ['class'] });
  }

  // Accessibility & touch target enforcement
  const interactiveEls = document.querySelectorAll('button, a, .lang-btn');
  if (interactiveEls.length) {
    interactiveEls.forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.width < 44) el.style.minWidth = '44px';
      if(r.height < 44) el.style.minHeight = '44px';
    });
  }

  // Smooth header shrink on scroll (guarded)
  const mainHeader = document.getElementById('main-header');
  if (mainHeader) {
    window.addEventListener('scroll', () => {
      if(window.scrollY > 40) {
        mainHeader.classList.add('bg-konncafe-black/95','backdrop-blur-sm','py-2');
      } else {
        mainHeader.classList.remove('bg-konncafe-black/95','backdrop-blur-sm','py-2');
      }
    });
  }

  // ensure no horizontal scroll
  document.documentElement.style.overflowX = 'hidden';
}

initMain();