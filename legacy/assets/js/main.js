/* Rahul Mishra — Portfolio interactions
   Theme toggle, sticky nav, mobile menu, scroll reveal, copy, toast, contact form, year. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var themeToggle = doc.getElementById('theme-toggle');
  var theme = root.getAttribute('data-theme') || 'dark';

  function setTheme(next, announce) {
    theme = next;
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    }
    if (announce) toast(theme === 'dark' ? 'Dark theme on' : 'Light theme on');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(theme === 'dark' ? 'light' : 'dark', true);
    });
  }
  setTheme(theme, false);

  /* ---------- Sticky header state ---------- */
  var header = doc.getElementById('header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = doc.getElementById('burger');
  var sheet = doc.getElementById('mobile-menu');

  function closeMenu() {
    if (!sheet) return;
    sheet.hidden = true;
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    }
  }

  if (burger && sheet) {
    burger.addEventListener('click', function () {
      var open = sheet.hidden;
      sheet.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    sheet.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu();
    });
    doc.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Active nav highlighting ---------- */
  var sections = doc.querySelectorAll('main section[id]');
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav__link'));
  var headerOffset = 10;

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  } else if (sections.length) {
    function activeOnScroll() {
      var pos = window.scrollY + header.offsetHeight + headerOffset;
      var current = sections[0].id;
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) current = s.id;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', activeOnScroll, { passive: true });
    activeOnScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = doc.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Toast ---------- */
  var toastEl = doc.getElementById('toast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2200);
  }
  window.__toast = toast;

  /* ---------- Copy email ---------- */
  doc.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.querySelector('.copy__say').textContent = 'Copied';
        toast('Email copied');
        setTimeout(function () { btn.querySelector('.copy__say').textContent = 'Copy'; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    var ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    doc.body.appendChild(ta);
    ta.select();
    try { doc.execCommand('copy'); } catch (e) { /* ignore */ }
    doc.body.removeChild(ta);
    done();
  }

  /* ---------- Resume download feedback ---------- */
  doc.querySelectorAll('[data-resume]').forEach(function (link) {
    link.addEventListener('click', function () {
      var label = link.textContent.trim().replace('Download', '').replace('résumé', '').trim();
      toast('Opening résumé');
    });
  });

  /* ---------- Contact form (mailto) ---------- */
  var form = doc.getElementById('contact-form');
  if (form) {
    var fields = {
      'cf-name': null, 'cf-email': null, 'cf-message': null
    };
    ['cf-name', 'cf-email', 'cf-message'].forEach(function (id) {
      fields[id] = doc.getElementById(id);
    });

    function showError(id) {
      var field = doc.getElementById(id).closest('.form__field');
      field.classList.add('is-invalid');
      var err = field.querySelector('[data-err-for="' + id + '"]');
      if (err) err.hidden = false;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var valid = true;
      Object.keys(fields).forEach(function (id) {
        var field = doc.getElementById(id).closest('.form__field');
        field.classList.remove('is-invalid');
        var err = field.querySelector('[data-err-for="' + id + '"]');
        if (err) err.hidden = true;
      });

      var name = fields['cf-name'].value.trim();
      var email = fields['cf-email'].value.trim();
      var message = fields['cf-message'].value.trim();

      if (!name) { showError('cf-name'); valid = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('cf-email'); valid = false; }
      if (!message) { showError('cf-message'); valid = false; }
      if (!valid) return;

      var subject = encodeURIComponent('Message from ' + name + ' — via portfolio');
      var body = encodeURIComponent(message + '\n\n— ' + name + '\n' + email);
      window.location.href = 'mailto:mrahuls104@gmail.com?subject=' + subject + '&body=' + body;
      var status = doc.getElementById('form-status');
      if (status) { status.textContent = 'Opening your email app…'; status.hidden = false; }
      form.reset();
    });

    /* Clear the per-field error as the user starts typing. */
    ['input', 'change'].forEach(function (evt) {
      form.addEventListener(evt, function (ev) {
        var t = ev.target;
        if (!t || !t.id || !fields[t.id]) return;
        var field = t.closest('.form__field');
        field.classList.remove('is-invalid');
        var err = field.querySelector('[data-err-for="' + t.id + '"]');
        if (err) err.hidden = true;
      });
    });
  }

  /* ---------- Dynamic year ---------- */
  var year = doc.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* ==========================================================================
   GitHub integration (real public data, cached, graceful fallback)
   ========================================================================== */
(function () {
  'use strict';
  var GH_USER = 'mrahulsit';
  var CACHE_KEY = 'gh-cache-v2';
  var CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

  var statsEl = document.getElementById('github-stats');
  var reposEl = document.getElementById('github-repos');
  if (!statsEl) return; // section not present

  function timeAgo(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    var mins = Math.round(s / 60);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    var days = Math.round(hrs / 24);
    if (days < 30) return days + 'd ago';
    var months = Math.round(days / 30);
    if (months < 12) return months + 'mo ago';
    return Math.round(months / 12) + 'y ago';
  }

  function langColor(lang) {
    var map = {
      'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'HTML': '#e34c26', 'CSS': '#563d7c',
      'Java': '#b07219', 'Python': '#3572A5', 'Shell': '#89e051', 'Dockerfile': '#384d54'
    };
    return map[lang] || '#b4452a';
  }

  function render(data) {
    var profile = data.profile, repos = data.repos;

    /* Stats strip */
    var langs = {};
    repos.forEach(function (r) { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    var langCount = Object.keys(langs).length;
    var active = repos.filter(function (r) { return !r.fork; }).filter(function (r) { return r.size > 0; });
    var latest = repos.reduce(function (a, b) { return new Date(a.pushed_at) > new Date(b.pushed_at) ? a : b; });

    var langRows = Object.keys(langs).map(function (k) { return { name: k, n: langs[k] }; })
      .sort(function (a, b) { return b.n - a.n; }).slice(0, 5);
    var langTotal = langRows.reduce(function (s, x) { return s + x.n; }, 0);

    /* Build language bar HTML */
    var langHTML = '';
    for (var i = 0; i < langRows.length; i++) {
      var l = langRows[i];
      var pct = Math.round(l.n / langTotal * 100);
      var fillW = Math.round(l.n / langTotal * 100);
      langHTML += '<div class="gh-langs__row">' +
        '<div class="gh-langs__name">' + l.name + '</div>' +
        '<div class="gh-langs__bar"><div class="gh-langs__fill" style="width:' + fillW + '%;background:' + langColor(l.name) + '"></div></div>' +
        '<div class="gh-langs__pct">' + pct + '%</div></div>';
    }

    statsEl.innerHTML =
      '<div class="gh-stat"><p class="gh-stat__k">' + profile.public_repos + '</p><p class="gh-stat__v">Public repositories</p></div>' +
      '<div class="gh-stat"><p class="gh-stat__k">' + langCount + '</p><p class="gh-stat__v">Languages worked in</p></div>' +
      '<div class="gh-stat"><p class="gh-stat__k">' + new Date(profile.created_at).getFullYear() + '</p><p class="gh-stat__v">On GitHub since</p></div>' +
      '<div class="gh-stat"><p class="gh-stat__k">' + active.length + '</p><p class="gh-stat__v">Active repositories</p></div>' +
      '<div class="gh-langs"><p class="gh-langs__h">Languages across repositories</p>' +
      langHTML + '</div>';

    /* Repo cards — most recently updated, non-forks */
    var picks = repos.filter(function (r) { return !r.fork; })
      .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); })
      .slice(0, 6);

    reposEl.innerHTML = picks.map(function (r) {
      return '<a class="gh-repo" href="' + r.html_url + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="gh-repo__top"><span class="gh-repo__name">' + r.name +
        '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>' +
        (r.homepage ? '<span class="gh-repo__pinned">Live</span>' : '') + '</span>' +
        '<span class="gh-repo__desc">' + (r.description || 'No description yet — a quiet experiment on GitHub.') + '</span>' +
        '<span class="gh-repo__meta">' +
        (r.language ? '<span class="gh-repo__lang">' + r.language + '</span>' : '') +
        '<span>Updated ' + timeAgo(r.pushed_at) + '</span></span></a>';
    }).join('');
  }

  function renderError() {
    statsEl.innerHTML = '<p class="gh-error">GitHub data couldn&rsquo;t load right now — but the profile is live, so poke around directly.</p>';
  }

  try {
    var cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      var c = JSON.parse(cached);
      if (Date.now() - c.t < CACHE_TTL) {
        render(c.d);
        return;
      }
    }
  } catch (e) { /* cache unreadable — fetch fresh */ }

  fetch('https://api.github.com/users/' + GH_USER)
    .then(function (r) { if (!r.ok) throw new Error('profile ' + r.status); return r.json(); })
    .then(function (profile) {
      return fetch('https://api.github.com/users/' + GH_USER + '/repos?sort=updated&per_page=100&type=public')
        .then(function (r) { if (!r.ok) throw new Error('repos ' + r.status); return r.json(); })
        .then(function (repos) {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: { profile: profile, repos: repos } }));
          } catch (e) { /* storage full — skip cache */ }
          render({ profile: profile, repos: repos });
        });
    })
    .catch(function () { renderError(); });
})();

/* ==========================================================================
   Command palette (⌘K)
   ========================================================================== */
(function () {
  'use strict';
  var palette = document.getElementById('palette');
  var input = document.getElementById('palette-input');
  var list = document.getElementById('palette-list');
  if (!palette) return;

  var COMMANDS = [
    { label: 'Go to Experience', section: '#experience' },
    { label: 'Go to Projects', section: '#projects' },
    { label: 'Go to Skills', section: '#skills' },
    { label: 'Go to GitHub', section: '#github' },
    { label: 'Go to Writing', section: '#writing' },
    { label: 'Go to Contact', section: '#contact' },
    { label: 'Toggle theme', action: 'theme' },
    { label: 'Download résumé', action: 'resume' },
    { label: 'Copy email', action: 'email' },
    { label: 'Open GitHub', action: 'open', url: 'https://github.com/mrahulsit' },
    { label: 'Open LinkedIn', action: 'open', url: 'https://www.linkedin.com/in/mrahulsit/' },
    { label: 'Open blog', action: 'open', url: 'https://effortlesswithrahul.hashnode.dev/' }
  ];
  var active = 0;
  var results = [];

  function showPalette(show) {
    palette.hidden = !show;
    document.body.style.overflow = show ? 'hidden' : '';
    if (show) {
      input.value = '';
      input.focus();
      renderList(COMMANDS);
    }
  }

  function renderList(items) {
    results = items;
    active = 0;
    if (!items.length) {
      list.innerHTML = '<p class="palette__empty">No matching commands</p>';
      return;
    }
    list.innerHTML = items.map(function (c, i) {
      return '<li class="palette__item' + (i === 0 ? ' is-active' : '') + '" role="option" data-i="' + i + '">' +
        '<b>' + c.label + '</b><kbd>' + (c.section ? '→' : '↵') + '</kbd></li>';
    }).join('');
    var el = list.querySelector('.is-active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function run(c) {
    showPalette(false);
    if (c.section) {
      var target = document.querySelector(c.section);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (c.action === 'theme') {
      var btn = document.getElementById('theme-toggle');
      if (btn) btn.click();
    } else if (c.action === 'resume') {
      window.open('./resume.html', '_blank');
    } else if (c.action === 'email') {
      var copy = document.querySelector('[data-copy]');
      if (copy) copy.click();
    } else if (c.action === 'open' && c.url) {
      window.open(c.url, '_blank');
    }
  }

  document.addEventListener('keydown', function (ev) {
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      showPalette(palette.hidden);
      return;
    }
    if (palette.hidden) return;
    if (ev.key === 'Escape') { showPalette(false); return; }
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(active + 1); }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(active - 1); }
    if (ev.key === 'Enter') { ev.preventDefault(); if (results[active]) run(results[active]); }
  });

  function setActive(i) {
    if (!results.length) return;
    active = (i + results.length) % results.length;
    list.querySelectorAll('.palette__item').forEach(function (el, idx) {
      el.classList.toggle('is-active', idx === active);
    });
    var el = list.querySelector('.is-active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    var items = q ? COMMANDS.filter(function (c) { return c.label.toLowerCase().indexOf(q) !== -1; }) : COMMANDS;
    renderList(items);
  });

  list.addEventListener('click', function (ev) {
    var item = ev.target.closest('.palette__item');
    if (item) run(results[Number(item.getAttribute('data-i'))]);
  });

  palette.addEventListener('click', function (ev) {
    if (ev.target === palette) showPalette(false);
  });
})();

/* ==========================================================================
   Availability indicator — configure in one place
   ========================================================================== */
(function () {
  'use strict';
  var AVAILABILITY = {
    open: true,                         // false -> amber "currently focused" note
    openLabel: 'Open to opportunities',
    busyLabel: 'Currently focused on shipping'
  };
  var avail = document.querySelector('.avail');
  if (avail) {
    avail.setAttribute('title', AVAILABILITY.open ? AVAILABILITY.openLabel : AVAILABILITY.busyLabel);
  }
})();

/* ==========================================================================
   Easter egg — type "sudo hire rahul"
   ========================================================================== */
(function () {
  'use strict';
  var phrase = 'sudo hire rahul';
  var buffer = '';
  var lastKeyTime = 0;
  var hasShown = false;

  document.addEventListener('keydown', function (ev) {
    // Ignore if typing in input/textarea or holding modifiers
    if (ev.metaKey || ev.ctrlKey || ev.altKey || ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA') {
      return;
    }

    var now = Date.now();
    // Reset buffer if more than 2 seconds between keypresses
    if (now - lastKeyTime > 2000) {
      buffer = '';
    }
    lastKeyTime = now;

    // Only capture printable characters and space
    if (ev.key.length === 1) {
      buffer = (buffer + ev.key.toLowerCase()).slice(-phrase.length);

      if (buffer === phrase) {
        buffer = '';

        // Show the terminal modal — this is the on-screen reveal
        var easterEgg = document.getElementById('easter-egg');
        if (easterEgg) {
          easterEgg.removeAttribute('hidden');
          easterEgg.setAttribute('data-active', '');
          document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal

          // Play typing animation sound if available
          try {
            if (typeof Audio !== 'undefined') {
              var keySound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAD+/////v///v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v///');
              keySound.volume = 0.3;
              keySound.play().catch(function() { /* ignore */ });
            }
          } catch(e) { /* ignore */ }
        }

    }
    }
  });

  // Add close functionality for the terminal modal
  var easterEgg = document.getElementById('easter-egg');
  if (easterEgg) {
    var closeBtn = easterEgg.querySelector('.easter-egg__close');
    var overlay = easterEgg.querySelector('.easter-egg__overlay');

    function closeTerminal() {
      easterEgg.removeAttribute('data-active');
      document.body.style.overflow = '';

      // Add a slight delay before hiding completely to allow animation
      setTimeout(function() {
        easterEgg.setAttribute('hidden', '');
      }, 300);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeTerminal);
    }

    if (overlay) {
      overlay.addEventListener('click', closeTerminal);
    }

    // Also close on Escape key
    document.addEventListener('keydown', function(ev) {
      if (ev.key === 'Escape' && easterEgg.hasAttribute('data-active')) {
        closeTerminal();
      }
    });
  }
})();

/* ==========================================================================
   Hero index card parallax on scroll
   ========================================================================== */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  
  var card = document.querySelector('.index-card');
  if (!card || window.innerWidth < 980) return; // only desktop
  
  var hero = document.querySelector('.hero');
  if (!hero) return;
  
  function updateParallax() {
    var scrollY = window.scrollY;
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    
    if (scrollY < heroBottom) {
      var progress = scrollY / heroBottom;
      var ty = progress * 40;
      var tz = progress * -30;
      var rx = progress * -3;
      card.style.transform = 'translateY(' + ty + 'px) translateZ(' + tz + 'px) rotateX(' + rx + 'deg)';
    }
  }
  
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
})();

/* ==========================================================================
   Visitor analytics (privacy-first, no external tracking)
   ========================================================================== */
(function () {
  'use strict';
  var STORAGE_KEY = 'rm-analytics';
  var SESSION_KEY = 'rm-session';

  function getAnalytics() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { totalVisits: 0, sessions: [] };
    } catch (e) {
      return { totalVisits: 0, sessions: [] };
    }
  }

  function saveAnalytics(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* storage full */ }
  }

  function initAnalytics() {
    var analytics = getAnalytics();
    var sessionId = sessionStorage.getItem(SESSION_KEY);
    
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(SESSION_KEY, sessionId);
      analytics.totalVisits++;
      analytics.sessions.push({ id: sessionId, time: Date.now() });
      
      // Keep only last 100 sessions
      if (analytics.sessions.length > 100) {
        analytics.sessions = analytics.sessions.slice(-100);
      }
      
      saveAnalytics(analytics);
    }

    // Count active sessions (last 5 minutes)
    var fiveMinAgo = Date.now() - 5 * 60 * 1000;
    var activeSessions = analytics.sessions.filter(function (s) {
      return s.time > fiveMinAgo;
    }).length;

    // Update footer display
    var visitorsEl = document.getElementById('foot-visitors');
    var totalEl = document.getElementById('foot-total');
    if (visitorsEl) visitorsEl.textContent = activeSessions;
    if (totalEl) totalEl.textContent = analytics.totalVisits;

    // Update session timestamp periodically
    var updateInterval = setInterval(function () {
      var a = getAnalytics();
      var idx = a.sessions.findIndex(function (s) { return s.id === sessionId; });
      if (idx !== -1) {
        a.sessions[idx].time = Date.now();
        saveAnalytics(a);
      }
    }, 60000); // every minute
  }

  initAnalytics();
})();

/* ==========================================================================
   Footer palette hint click
   ========================================================================== */
(function () {
  'use strict';
  var hint = document.getElementById('foot-palette-hint');
  if (hint) {
    hint.addEventListener('click', function () {
      var palette = document.getElementById('palette');
      if (palette) {
        palette.hidden = false;
        var input = document.getElementById('palette-input');
        if (input) input.focus();
      }
    });
  }
})();

/* ==========================================================================
   Mini-game inside the easter egg terminal — "keyhunter" (snake)
   ========================================================================== */
(function () {
  'use strict';

  var canvas = document.querySelector('.easter-game__canvas');
  var startBtn = document.querySelector('.easter-game__start');
  var overlay = document.querySelector('.easter-game__overlay');
  var scoreEl = document.querySelector('.easter-game__scoreval');
  var bestEl = document.querySelector('.easter-game__best');
  var statusEl = document.querySelector('.easter-game__status');

  if (!canvas || !startBtn) return;

  var ctx = canvas.getContext('2d');
  var COLS = 15;
  var CELL = canvas.width / COLS;

  var snake, dir, dirNext, food, score, best, loop, running;
  var frame = 0;

  try {
    best = parseInt(localStorage.getItem('keyhunter_best') || '0', 10) || 0;
  } catch (e) { best = 0; }
  if (bestEl) bestEl.textContent = best;

  function reset() {
    snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
    dir = { x: 1, y: 0 };
    dirNext = dir;
    score = 0;
    frame = 0;
    placeFood();
    if (scoreEl) scoreEl.textContent = score;
    if (statusEl) { statusEl.textContent = 'running'; statusEl.classList.remove('is-over'); }
  }

  function placeFood() {
    var free;
    do {
      free = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * COLS) };
    } while (snake.some(function (s) { return s.x === free.x && s.y === free.y; }));
    food = free;
  }

  function step() {
    var head = { x: snake[0].x + dirNext.x, y: snake[0].y + dirNext.y };
    dir = dirNext;

    // wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= COLS) return gameOver();
    // self collision
    if (snake.some(function (s) { return s.x === head.x && s.y === head.y; })) return gameOver();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      if (scoreEl) scoreEl.textContent = score;
      if (score > best) { best = score; if (bestEl) bestEl.textContent = best; }
      placeFood();
      speedUp();
    } else {
      snake.pop();
    }

    draw();
  }

  function speedUp() {
    clearInterval(loop);
    var delay = Math.max(60, 150 - score * 6);
    loop = setInterval(step, delay);
  }

  function gameOver() {
    running = false;
    clearInterval(loop);
    try { localStorage.setItem('keyhunter_best', String(best)); } catch (e) {}
    if (statusEl) { statusEl.textContent = 'game over'; statusEl.classList.add('is-over'); }
    ctx.fillStyle = '#04070f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f85149';
    ctx.font = 'bold 15px "SF Mono", Monaco, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER — score ' + score, canvas.width / 2, canvas.height / 2 - 4);

    if (overlay) {
      overlay.classList.remove('is-hidden');
      var tag = overlay.querySelector('.easter-game__tag');
      if (tag) tag.textContent = 'Final score ' + score + ' · press to retry ';
      var btnLabel = overlay.querySelector('.easter-game__start span') || startBtn;
      return;
    }
  }

  function start() {
    reset();
    running = true;
    if (overlay) overlay.classList.add('is-hidden');
    speedUp();
    draw();
  }

  function draw() {
    ctx.fillStyle = '#04070f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // food (a key)
    ctx.fillStyle = '#e3b341';
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.fillStyle = '#04070f';
    var kx = food.x * CELL, ky = food.y * CELL;
    ctx.fillRect(kx + CELL / 2 - 2, ky + 6, 2, CELL - 12);
    ctx.fillRect(kx + 6, ky + CELL / 2 - 2, CELL - 12, 2);

    // snake body
    ctx.fillStyle = '#238636';
    for (var i = 0; i < snake.length; i++) {
      var s = snake[i];
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    }
    // head
    ctx.fillStyle = '#3fb950';
    ctx.fillRect(snake[0].x * CELL + 1, snake[0].y * CELL + 1, CELL - 2, CELL - 2);
  }

  if (startBtn) startBtn.addEventListener('click', start);

  document.addEventListener('keydown', function (ev) {
    var k = ev.key.toLowerCase();
    var map = {
      arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
      arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
      arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
      arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      ' ': 'restart'
    };
    if (!map[k]) return;

    // only steer when a game is running and terminal is open
    var egg = document.getElementById('easter-egg');
    if (!egg || !egg.hasAttribute('data-active')) return;

    if (map[k] === 'restart') {
      ev.preventDefault();
      if (!running) start();
      return;
    }

    ev.preventDefault();
    if (!running) return;
    if (dir) {
      // prevent reversing into itself
      if (dir.x + map[k].x === 0 && dir.y + map[k].y === 0) return;
      dirNext = map[k];
    }
  });

  // initial paint
  ctx.fillStyle = '#04070f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
})();
