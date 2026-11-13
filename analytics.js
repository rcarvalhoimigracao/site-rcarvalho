/* Medição de visitas (Google Analytics 4) com consentimento.
   Nada do Google é carregado antes de a pessoa clicar em "Aceitar". */
(function () {
  var GA_ID = 'G-S5EW45H5BB';
  var KEY = 'cookie-consent';

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var loaded = false;
  function loadGA() {
    if (loaded) return; loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Conta cliques nos botões marcados com data-track (só se houver consentimento)
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (el && loaded && window.gtag) {
      gtag('event', 'clique_botao', { nome_botao: el.getAttribute('data-track') });
    }
  });

  function css() {
    var st = document.createElement('style');
    st.textContent =
      '#ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#0B1B3A;color:#F6F0E2;border-radius:12px;padding:16px 18px;font:15px/1.5 Inter,system-ui,sans-serif;' +
      'box-shadow:0 8px 30px rgba(0,0,0,.3)}#ck p{margin:0 0 12px}#ck a{color:#D9A441}' +
      '#ck .b{display:flex;gap:10px;flex-wrap:wrap}#ck button{cursor:pointer;border-radius:8px;padding:10px 16px;' +
      'font:600 15px Inter,system-ui,sans-serif;border:1px solid #D9A441}' +
      '#ck .y{background:#D9A441;color:#0B1B3A}#ck .n{background:transparent;color:#F6F0E2}';
    document.head.appendChild(st);
  }

  function banner() {
    if (document.getElementById('ck')) return;
    css();
    var d = document.createElement('div');
    d.id = 'ck'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML =
      '<p>Uso cookies para medir as visitas e entender o que ajuda mais quem entra no site. ' +
      'Você pode aceitar ou recusar: o site funciona igual nos dois casos. ' +
      '<a href="privacidade.html">Saiba mais</a>.</p>' +
      '<div class="b"><button class="y" type="button">Aceitar</button>' +
      '<button class="n" type="button">Recusar</button></div>';
    document.body.appendChild(d);
    d.querySelector('.y').onclick = function () { setChoice('granted'); d.remove(); loadGA(); };
    d.querySelector('.n').onclick = function () { setChoice('denied'); d.remove(); };
  }

  // Link "Preferências de cookies" no rodapé reabre o aviso
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'ck-prefs') { e.preventDefault(); banner(); }
  });

  function init() {
    var c = getChoice();
    if (c === 'granted') loadGA();
    else if (c !== 'denied') banner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
