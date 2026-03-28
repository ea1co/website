(function () {

  // ── NAV ITEMS ── comment out items here to hide them sitewide
  const NAV_ITEMS = [
    // { href: 'approach.html', label: 'Approach' },
    { href: 'work.html',     label: 'Work' },
    { href: 'team.html', label: 'Team' },
    { href: 'https://everybodyatonce.substack.com/', label: 'Newsletter', external: true },
    { href: '#', label: 'Contact', id: 'nav-contact', onclick: 'openContactQuiz(); return false;' },
  ];

  // ── ACTIVE PAGE DETECTION ──
  var page = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    if (href === 'work.html') {
      return page === 'work.html' || page.indexOf('work-') === 0;
    }
    return page === href;
  }

  // ── BUILD NAV HTML ──
  var lis = NAV_ITEMS.map(function (item) {
    var attrs = '';
    if (item.id)      attrs += ' id="' + item.id + '"';
    if (isActive(item.href)) attrs += ' class="active"';
    if (item.external) attrs += ' target="_blank" rel="noopener"';
    if (item.onclick) attrs += ' onclick="' + item.onclick + '"';
    return '<li><a href="' + item.href + '"' + attrs + '>' + item.label + '</a></li>';
  }).join('\n      ');

  var navHTML = [
    '<nav id="main-nav">',
    '  <a href="index.html" class="nav-logo">EA1</a>',
    '  <ul class="nav-links">',
    '    ' + lis,
    '  </ul>',
    '  <button class="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">',
    '    <span></span><span></span><span></span>',
    '  </button>',
    '</nav>'
  ].join('\n');

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // ── HAMBURGER TOGGLE ──
  var nav = document.getElementById('main-nav');
  var btn = nav.querySelector('.nav-hamburger');

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // ── BODY FADE-IN (fonts ready) ──
  document.fonts.ready.then(function () {
    document.body.style.opacity = '1';
  });

})();
