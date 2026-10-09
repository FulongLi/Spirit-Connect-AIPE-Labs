/* AIPE Hub — client-side search and domain filtering.
   Progressive enhancement only: without JavaScript every artifact is rendered and
   the search form submits to the Hub overview. */
(function () {
  'use strict';

  var indexCache = {};
  function loadIndex(url) {
    if (!indexCache[url]) {
      indexCache[url] = fetch(url, { credentials: 'same-origin' })
        .then(function (response) { return response.ok ? response.json() : []; })
        .catch(function () { return []; });
    }
    return indexCache[url];
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function score(entry, terms) {
    var title = entry.t.toLowerCase();
    var tags = ((entry.k || '') + ' ' + (entry.x || '')).toLowerCase();
    var text = (entry.d || '').toLowerCase();
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var s = 0;
      if (title.indexOf(term) === 0 || title.indexOf(' ' + term) !== -1) s += 7;
      else if (title.indexOf(term) !== -1) s += 5;
      if (tags.indexOf(term) !== -1) s += 3;
      if (text.indexOf(term) !== -1) s += 1;
      if (!s) return 0;
      total += s;
    }
    return total + (entry.w || 0);
  }

  function search(entries, query) {
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var seenUrls = new Set();
    return entries
      .map(function (entry) { return { entry: entry, score: score(entry, terms) }; })
      .filter(function (hit) { return hit.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .filter(function (hit) {
        // A lesson can also be a Hub artifact. Show its best matching record once.
        if (seenUrls.has(hit.entry.u)) return false;
        seenUrls.add(hit.entry.u);
        return true;
      })
      .slice(0, 8)
      .map(function (hit) { return hit.entry; });
  }

  document.querySelectorAll('[data-hub-search]').forEach(function (form) {
    var input = form.querySelector('input[type="search"]');
    var list = form.querySelector('.hub-search-results');
    if (!input || !list) return;
    var active = -1;
    var hits = [];

    function close() {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    }

    function highlight(index) {
      var options = list.querySelectorAll('[role="option"]');
      options.forEach(function (option, i) { option.setAttribute('aria-selected', i === index ? 'true' : 'false'); });
      active = index;
      if (options[index]) {
        input.setAttribute('aria-activedescendant', options[index].id);
        options[index].scrollIntoView({ block: 'nearest' });
      }
    }

    function render(query) {
      loadIndex(form.dataset.index).then(function (entries) {
        if (input.value.trim() !== query) return;
        hits = search(entries, query);
        if (!query) { close(); return; }
        if (!hits.length) {
          list.innerHTML = '<li class="hub-search-empty">' + escapeHtml(form.dataset.empty) + '</li>';
        } else {
          list.innerHTML = hits.map(function (hit, i) {
            return '<li role="option" id="' + input.id + '-opt-' + i + '" aria-selected="false">' +
              '<a href="' + escapeHtml(hit.u) + '"><span class="hub-search-kind">' + escapeHtml(hit.k) + '</span>' +
              '<strong>' + escapeHtml(hit.t) + '</strong>' +
              (hit.d ? '<span class="hub-search-desc">' + escapeHtml(hit.d) + '</span>' : '') + '</a></li>';
          }).join('');
        }
        list.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        active = -1;
      });
    }

    input.addEventListener('focus', function () { loadIndex(form.dataset.index); if (input.value.trim()) render(input.value.trim()); });
    input.addEventListener('input', function () { render(input.value.trim()); });
    input.addEventListener('keydown', function (event) {
      var count = list.querySelectorAll('[role="option"]').length;
      if (event.key === 'ArrowDown' && count) { event.preventDefault(); highlight((active + 1) % count); }
      else if (event.key === 'ArrowUp' && count) { event.preventDefault(); highlight((active - 1 + count) % count); }
      else if (event.key === 'Escape') { close(); }
    });
    form.addEventListener('submit', function (event) {
      var target = hits[active >= 0 ? active : 0];
      if (target && !list.hidden) { event.preventDefault(); window.location.href = target.u; }
    });
    document.addEventListener('click', function (event) { if (!form.contains(event.target)) close(); });

    var section = form.parentElement;
    if (section) {
      section.querySelectorAll('[data-hub-suggest]').forEach(function (chip) {
        chip.addEventListener('click', function (event) {
          event.preventDefault();
          input.value = chip.dataset.hubSuggest;
          input.focus();
          render(input.value);
        });
      });
    }

    var initial = new URLSearchParams(window.location.search).get('q');
    if (initial && form.action.split('?')[0] === window.location.href.split(/[?#]/)[0]) {
      input.value = initial;
      render(initial.trim());
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (document.activeElement && document.activeElement.isContentEditable)) return;
    var input = document.querySelector('[data-hub-search] input[type="search"]');
    if (input) { event.preventDefault(); input.focus(); }
  });

  document.querySelectorAll('[data-hub-filter]').forEach(function (group) {
    var grids = document.querySelectorAll('[data-hub-grid]');
    if (!grids.length) return;
    var buttons = group.querySelectorAll('[data-domain]');

    function apply(domain, updateUrl) {
      var totalShown = 0;
      grids.forEach(function (grid) {
        var shown = 0;
        grid.querySelectorAll('[data-domains]').forEach(function (card) {
          var match = !domain || (' ' + card.dataset.domains + ' ').indexOf(' ' + domain + ' ') !== -1;
          card.hidden = !match;
          if (match) shown++;
        });
        totalShown += shown;
        var listing = grid.closest('.hub-overview-listing');
        if (listing) listing.hidden = shown === 0;
        var empty = grid.parentElement.querySelector('.hub-filter-empty');
        if (empty) empty.hidden = !!listing || shown > 0;
      });
      var overviewEmpty = document.querySelector('.hub-overview-empty');
      if (overviewEmpty) overviewEmpty.hidden = totalShown > 0;
      buttons.forEach(function (button) { button.setAttribute('aria-pressed', button.dataset.domain === domain ? 'true' : 'false'); });
      if (updateUrl && window.history.replaceState) {
        var url = new URL(window.location.href);
        if (domain) url.searchParams.set('domain', domain); else url.searchParams.delete('domain');
        window.history.replaceState(null, '', url);
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () { apply(button.dataset.domain, true); });
    });
    var requested = new URLSearchParams(window.location.search).get('domain');
    if (requested) apply(requested, false);
  });
})();
