/*
 * AIPE Academy engineering knowledge graph.
 *
 * Renders _includes/academy-knowledge-graph.html data as a 2D SVG map:
 * one horizontal lane per subject, and columns in prerequisite order (a topic
 * sits to the right of everything it requires). The layout is deterministic and
 * computed from the data, so new topics and lessons need no changes here.
 *
 * Interactions: drag to pan, pinch or Ctrl/⌘ + wheel to zoom, +/−/reset
 * buttons, click or Enter on a topic to show its details in the side panel.
 */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var COL_W = 172;
  var ROW_H = 50;
  var NODE_H = 40;
  var NODE_MAX_W = 146;
  var LANE_HEAD = 34;
  var LANE_PAD = 10;
  var MARGIN = 24;
  var PANEL_W = 340;
  var MIN_SCALE = 0.3;
  var MAX_SCALE = 2.2;

  function el(name, attrs, parent) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  function html(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // Greedy word wrap into at most two lines that fit `max` pixels.
  function wrap(textElement, text, max) {
    var words = text.split(' ');
    if (words.length === 1) return [text];
    var probe = el('tspan', {}, textElement);
    var lines = [];
    var current = '';
    words.forEach(function (word) {
      var next = current ? current + ' ' + word : word;
      probe.textContent = next;
      if (current && probe.getComputedTextLength() > max && lines.length === 0) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    });
    lines.push(current);
    textElement.removeChild(probe);
    return lines;
  }

  function init(root) {
    var dataElement = root.querySelector('.kg-data');
    var stage = root.querySelector('.kg-stage');
    var svg = root.querySelector('.kg-svg');
    var panel = root.querySelector('.kg-panel');
    var panelBody = root.querySelector('.kg-panel-content');
    var panelClose = root.querySelector('.kg-panel-close');
    if (!dataElement || !stage || !svg || !panel || !panelBody) return;

    var data;
    try { data = JSON.parse(dataElement.textContent); } catch (error) { root.classList.add('is-unavailable'); return; }

    var subjects = data.subjects;
    var subjectByKey = {};
    subjects.forEach(function (subject, index) { subject.index = index; subjectByKey[subject.key] = subject; });

    var byId = {};
    data.nodes.forEach(function (node, index) {
      node.order = index;
      node.requires = node.requires || [];
      node.related = node.related || [];
      node.lessons = node.lessons || [];
      node.resources = node.resources || [];
      node.dependents = [];
      node.children = [];
      byId[node.id] = node;
    });
    data.nodes.forEach(function (node) {
      node.requires = node.requires.filter(function (id) { return byId[id]; });
      node.related = node.related.filter(function (id) { return byId[id]; });
      node.requires.forEach(function (id) { byId[id].dependents.push(node.id); });
      if (node.parent && byId[node.parent]) byId[node.parent].children.push(node.id);
    });

    // Visible topics: everything, or one subject plus its direct neighbours.
    var visible = {};
    data.nodes.forEach(function (node) {
      if (!data.scope || node.subject === data.scope) visible[node.id] = true;
    });
    if (data.scope) {
      data.nodes.forEach(function (node) {
        if (node.subject !== data.scope) return;
        node.requires.concat(node.dependents).forEach(function (id) { visible[id] = true; });
      });
    }
    var nodes = data.nodes.filter(function (node) { return visible[node.id]; });
    nodes.forEach(function (node) { node.external = Boolean(data.scope) && node.subject !== data.scope; });

    // Column = longest prerequisite chain among visible topics, compacted.
    var depth = {};
    function depthOf(node, trail) {
      if (depth[node.id] !== undefined) return depth[node.id];
      if (trail[node.id]) return 0;
      trail[node.id] = true;
      var value = 0;
      node.requires.forEach(function (id) {
        if (visible[id]) value = Math.max(value, depthOf(byId[id], trail) + 1);
      });
      depth[node.id] = value;
      return value;
    }
    nodes.forEach(function (node) { depthOf(node, {}); });
    var levels = Array.from(new Set(nodes.map(function (node) { return depth[node.id]; }))).sort(function (a, b) { return a - b; });
    nodes.forEach(function (node) { node.col = levels.indexOf(depth[node.id]); });

    // Lanes: subjects in curriculum order; rows within a lane by column,
    // ordered by the average row of each topic's prerequisites.
    var lanes = subjects.filter(function (subject) {
      return nodes.some(function (node) { return node.subject === subject.key; });
    });
    var top = MARGIN;
    var columns = levels.length;
    lanes.forEach(function (lane) {
      var laneNodes = nodes.filter(function (node) { return node.subject === lane.key; });
      var rows = 1;
      for (var col = 0; col < columns; col += 1) {
        var cell = laneNodes.filter(function (node) { return node.col === col; });
        cell.forEach(function (node) {
          var placed = node.requires.map(function (id) { return byId[id]; }).filter(function (req) { return visible[req.id] && req.subject === lane.key && req.row !== undefined; });
          node.weight = placed.length ? placed.reduce(function (sum, req) { return sum + req.row; }, 0) / placed.length : node.order / 100;
        });
        cell.sort(function (a, b) { return a.weight - b.weight || a.order - b.order; });
        cell.forEach(function (node, row) { node.row = row; });
        rows = Math.max(rows, cell.length);
      }
      lane.top = top;
      lane.height = LANE_HEAD + rows * ROW_H + LANE_PAD;
      laneNodes.forEach(function (node) {
        node.x = MARGIN + node.col * COL_W + COL_W / 2;
        node.y = lane.top + LANE_HEAD + node.row * ROW_H + ROW_H / 2 + (rows - laneNodes.filter(function (other) { return other.col === node.col; }).length) * ROW_H / 2;
      });
      top += lane.height + 10;
    });
    var contentW = MARGIN * 2 + columns * COL_W;
    var contentH = top - 10 + MARGIN;

    // ── Render ──
    var defs = el('defs', {}, svg);
    var marker = el('marker', { id: 'kg-arrow-' + (data.scope || 'all'), viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0,0 L10,5 L0,10 z', class: 'kg-arrow-head' }, marker);
    var arrowRef = 'url(#' + marker.id + ')';

    var viewport = el('g', { class: 'kg-viewport' }, svg);
    var laneLayer = el('g', { class: 'kg-lanes' }, viewport);
    var edgeLayer = el('g', { class: 'kg-edges' }, viewport);
    var nodeLayer = el('g', { class: 'kg-nodes' }, viewport);

    lanes.forEach(function (lane) {
      var group = el('g', { class: 'kg-lane' + (data.scope && lane.key !== data.scope ? ' is-external' : '') }, laneLayer);
      el('rect', { x: MARGIN - 8, y: lane.top, width: contentW - MARGIN * 2 + 16, height: lane.height, rx: 16, class: 'kg-lane-band' }, group);
      var label = el('g', { class: 'kg-lane-label', tabindex: '0', role: 'button', 'aria-label': lane.title }, group);
      el('circle', { cx: MARGIN + 6, cy: lane.top + 19, r: 4, fill: lane.color }, label);
      var title = el('text', { x: MARGIN + 18, y: lane.top + 23, class: 'kg-lane-title' }, label);
      var number = el('tspan', { class: 'kg-lane-number' }, title);
      number.textContent = lane.number + '  ';
      var name = el('tspan', {}, title);
      name.textContent = lane.title;
      label.addEventListener('click', function () { if (!moved) showSubject(lane); });
      label.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showSubject(lane); }
      });
    });

    var edges = [];
    function addEdge(from, to, type) {
      if (!visible[from.id] || !visible[to.id]) return;
      edges.push({ from: from, to: to, type: type });
    }
    nodes.forEach(function (node) {
      node.requires.forEach(function (id) { addEdge(byId[id], node, node.parent === id ? 'part' : 'prereq'); });
      node.related.forEach(function (id) {
        if (byId[id].related.indexOf(node.id) === -1 || node.order < byId[id].order) addEdge(node, byId[id], 'related');
      });
    });

    var nodeElements = {};
    nodes.forEach(function (node) {
      var subject = subjectByKey[node.subject];
      var hasLessons = node.lessons.length > 0;
      var group = el('g', {
        class: 'kg-node' + (hasLessons ? ' has-lessons' : ' is-planned') + (node.external ? ' is-external' : ''),
        transform: 'translate(' + node.x + ',' + node.y + ')',
        tabindex: '0',
        role: 'button',
        'aria-label': node.title + ' — ' + subject.title + ' — ' + (hasLessons ? data.text.withLessons : data.text.planned)
      }, nodeLayer);
      var box = el('rect', { y: -NODE_H / 2, height: NODE_H, rx: 11, class: 'kg-node-box' }, group);
      var dot = el('circle', { r: 4.5, cy: 0, class: 'kg-node-dot', stroke: subject.color, fill: hasLessons ? subject.color : 'transparent' }, group);
      var label = el('text', { class: 'kg-node-label' }, group);
      var lines = wrap(label, node.title, NODE_MAX_W - 36);
      var textW = 0;
      lines.forEach(function (line, index) {
        var span = el('tspan', { dy: index === 0 ? (lines.length > 1 ? -2.5 : 4.5) : 14 }, label);
        span.textContent = line;
        textW = Math.max(textW, span.getComputedTextLength());
      });
      var width = Math.max(84, Math.min(NODE_MAX_W, textW + 38));
      box.setAttribute('x', -width / 2);
      box.setAttribute('width', width);
      dot.setAttribute('cx', -width / 2 + 14);
      label.querySelectorAll('tspan').forEach(function (span) { span.setAttribute('x', -width / 2 + 26); });
      node.width = width;
      group.addEventListener('click', function () { if (!moved) select(node.id); });
      group.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(node.id); }
      });
      group.addEventListener('mouseenter', function () { highlight(node.id); });
      group.addEventListener('mouseleave', function () { highlight(selected); });
      group.addEventListener('focus', function () { highlight(node.id); });
      group.addEventListener('blur', function () { highlight(selected); });
      nodeElements[node.id] = group;
    });

    edges.forEach(function (edge) {
      var from = edge.from;
      var to = edge.to;
      var d;
      if (edge.type === 'related') {
        var midX = (from.x + to.x) / 2;
        var bend = from.col === to.col ? 70 : 0;
        d = 'M' + from.x + ',' + from.y + ' Q' + (midX + bend) + ',' + ((from.y + to.y) / 2 - 24) + ' ' + to.x + ',' + to.y;
      } else {
        var x1 = from.x + from.width / 2;
        var x2 = to.x - to.width / 2 - 3;
        var span = Math.max(40, (x2 - x1) / 2);
        d = 'M' + x1 + ',' + from.y + ' C' + (x1 + span) + ',' + from.y + ' ' + (x2 - span) + ',' + to.y + ' ' + x2 + ',' + to.y;
      }
      var attrs = { d: d, class: 'kg-edge kg-edge-' + edge.type };
      if (edge.type !== 'related') attrs['marker-end'] = arrowRef;
      if (edge.type === 'part') attrs.stroke = subjectByKey[to.subject].color;
      edge.element = el('path', attrs, edgeLayer);
    });

    // ── Highlight and selection ──
    var selected = null;
    function neighbours(id) {
      var node = byId[id];
      var set = {};
      set[id] = true;
      node.requires.concat(node.dependents, node.related).forEach(function (other) { set[other] = true; });
      nodes.forEach(function (other) { if (other.related.indexOf(id) !== -1) set[other.id] = true; });
      return set;
    }
    function highlight(id) {
      svg.classList.toggle('has-focus', Boolean(id));
      var near = id ? neighbours(id) : {};
      Object.keys(nodeElements).forEach(function (key) {
        nodeElements[key].classList.toggle('is-near', Boolean(near[key]));
        nodeElements[key].classList.toggle('is-selected', key === selected);
      });
      edges.forEach(function (edge) {
        edge.element.classList.toggle('is-near', Boolean(id) && (edge.from.id === id || edge.to.id === id));
      });
    }

    function chips(title, ids, container) {
      if (!ids.length) return;
      container.appendChild(html('h4', '', title));
      var list = html('div', 'kg-chips');
      ids.forEach(function (id) {
        var other = byId[id];
        var chip;
        if (visible[id]) {
          chip = html('button', 'kg-chip', other.title);
          chip.type = 'button';
          chip.addEventListener('click', function () { select(id, true); });
        } else {
          chip = html('a', 'kg-chip', other.title);
          chip.href = subjectByKey[other.subject].url;
        }
        chip.style.setProperty('--kg-color', subjectByKey[other.subject].color);
        list.appendChild(chip);
      });
      container.appendChild(list);
    }

    function select(id, centre) {
      selected = id;
      highlight(id);
      var node = byId[id];
      var subject = subjectByKey[node.subject];
      panelBody.innerHTML = '';
      var body = html('div', 'kg-panel-body');
      var kicker = html('span', 'kg-panel-subject', subject.number + ' · ' + subject.title);
      kicker.style.setProperty('--kg-color', subject.color);
      body.appendChild(kicker);
      body.appendChild(html('h3', '', node.title));
      body.appendChild(html('p', '', node.summary));
      chips(data.text.partOf, node.parent ? [node.parent] : [], body);
      chips(data.text.prerequisites, node.requires.filter(function (other) { return other !== node.parent; }), body);
      chips(data.text.subtopics, node.children, body);
      chips(data.text.leadsTo, node.dependents.filter(function (other) { return node.children.indexOf(other) === -1; }), body);
      var related = node.related.slice();
      data.nodes.forEach(function (other) { if (other.related.indexOf(id) !== -1 && related.indexOf(other.id) === -1) related.push(other.id); });
      chips(data.text.related, related, body);

      body.appendChild(html('h4', '', data.text.lessons));
      if (node.lessons.length) {
        var lessons = html('ul', 'kg-lessons');
        node.lessons.forEach(function (lesson) {
          var item = html('li');
          var link = html('a', '', lesson.title);
          link.href = lesson.url;
          item.appendChild(link);
          var meta = html('span', 'kg-lesson-meta');
          meta.appendChild(html('span', 'academy-lesson-type', lesson.type));
          meta.appendChild(html('span', 'status-badge status-' + lesson.status, lesson.statusLabel));
          item.appendChild(meta);
          lessons.appendChild(item);
        });
        body.appendChild(lessons);
      } else {
        body.appendChild(html('p', 'kg-planned-note', data.text.plannedNote));
      }
      if (node.resources.length) {
        body.appendChild(html('h4', '', data.text.resources));
        var resources = html('ul', 'kg-resources');
        node.resources.forEach(function (resource) {
          var item = html('li');
          var link = html('a', '', resource.label + ' →');
          link.href = resource.url;
          item.appendChild(link);
          resources.appendChild(item);
        });
        body.appendChild(resources);
      }
      if (node.subject !== data.scope && (data.scope || false)) {
        var open = html('a', 'kg-subject-link', data.text.openSubject + ' →');
        open.href = subject.url;
        body.appendChild(open);
      }
      panelBody.appendChild(body);
      openPanel();
      var box = size();
      var screenX = view.x + node.x * view.k;
      var covered = box.w > 760 ? screenX > box.w - PANEL_W - 40 : view.y + node.y * view.k > box.h * 0.4;
      if (centre || covered || screenX < 40) centreOn(node);
    }

    function openPanel() {
      panel.hidden = false;
      root.classList.add('has-panel');
      panelBody.scrollTop = 0;
    }
    function closePanel() {
      panel.hidden = true;
      root.classList.remove('has-panel');
      selected = null;
      highlight(null);
    }
    if (panelClose) panelClose.addEventListener('click', closePanel);
    root.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !panel.hidden) closePanel(); });

    function showSubject(lane) {
      selected = null;
      highlight(null);
      panelBody.innerHTML = '';
      var body = html('div', 'kg-panel-body');
      var kicker = html('span', 'kg-panel-subject', lane.number);
      kicker.style.setProperty('--kg-color', lane.color);
      body.appendChild(kicker);
      body.appendChild(html('h3', '', lane.title));
      body.appendChild(html('p', '', lane.summary));
      if (lane.key !== data.scope) {
        var open = html('a', 'kg-subject-link', data.text.openSubject + ' →');
        open.href = lane.url;
        body.appendChild(open);
      }
      panelBody.appendChild(body);
      openPanel();
    }

    // ── Pan and zoom ──
    var view = { x: 0, y: 0, k: 1 };
    var interacted = false;
    var moved = false;
    function apply() {
      viewport.setAttribute('transform', 'translate(' + view.x + ',' + view.y + ') scale(' + view.k + ')');
    }
    function size() {
      return { w: stage.clientWidth || 600, h: stage.clientHeight || 400 };
    }
    function reset() {
      var box = size();
      var fit = Math.min(box.w / contentW, box.h / contentH);
      // Keep labels readable: below this, start at the left of the map and pan.
      var readable = box.w < 720 ? 0.62 : 0.7;
      view.k = Math.min(1.05, Math.max(fit, Math.min(readable, 1)));
      view.x = view.k * contentW <= box.w ? (box.w - view.k * contentW) / 2 : 0;
      view.y = view.k * contentH <= box.h ? (box.h - view.k * contentH) / 2 : 0;
      apply();
    }
    function zoomAt(factor, px, py) {
      var k = Math.max(MIN_SCALE, Math.min(MAX_SCALE, view.k * factor));
      view.x = px - (px - view.x) * (k / view.k);
      view.y = py - (py - view.y) * (k / view.k);
      view.k = k;
      interacted = true;
      apply();
    }
    function centreOn(node) {
      var box = size();
      var visibleW = !panel.hidden && box.w > 760 ? box.w - PANEL_W : box.w;
      view.x = visibleW / 2 - node.x * view.k;
      view.y = (!panel.hidden && box.w <= 760 ? box.h * 0.22 : box.h / 2) - node.y * view.k;
      interacted = true;
      apply();
    }

    var pointers = new Map();
    var start = null;
    function stagePoint(event) {
      var rect = svg.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    svg.addEventListener('pointerdown', function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      pointers.set(event.pointerId, stagePoint(event));
      moved = false;
      start = { view: { x: view.x, y: view.y, k: view.k }, points: Array.from(pointers.values()).map(function (p) { return { x: p.x, y: p.y }; }) };
    });
    svg.addEventListener('pointermove', function (event) {
      if (!pointers.has(event.pointerId) || !start) return;
      pointers.set(event.pointerId, stagePoint(event));
      var points = Array.from(pointers.values());
      if (points.length === 1 && start.points.length === 1) {
        var dx = points[0].x - start.points[0].x;
        var dy = points[0].y - start.points[0].y;
        if (!moved && Math.hypot(dx, dy) < 4) return;
        if (!moved) { moved = true; svg.setPointerCapture(event.pointerId); svg.classList.add('is-panning'); }
        view.x = start.view.x + dx;
        view.y = start.view.y + dy;
        interacted = true;
        apply();
      } else if (points.length >= 2 && start.points.length >= 2) {
        moved = true;
        var d0 = Math.hypot(start.points[0].x - start.points[1].x, start.points[0].y - start.points[1].y) || 1;
        var d1 = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        var cx = (points[0].x + points[1].x) / 2;
        var cy = (points[0].y + points[1].y) / 2;
        var k = Math.max(MIN_SCALE, Math.min(MAX_SCALE, start.view.k * d1 / d0));
        var sx = (start.points[0].x + start.points[1].x) / 2;
        var sy = (start.points[0].y + start.points[1].y) / 2;
        view.k = k;
        view.x = cx - (sx - start.view.x) * (k / start.view.k);
        view.y = cy - (sy - start.view.y) * (k / start.view.k);
        interacted = true;
        apply();
      }
    });
    function end(event) {
      pointers.delete(event.pointerId);
      svg.classList.remove('is-panning');
      if (pointers.size === 0) {
        start = null;
        setTimeout(function () { moved = false; }, 0);
      } else {
        start = { view: { x: view.x, y: view.y, k: view.k }, points: Array.from(pointers.values()).map(function (p) { return { x: p.x, y: p.y }; }) };
      }
    }
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    svg.addEventListener('wheel', function (event) {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      var point = stagePoint(event);
      zoomAt(Math.exp(-event.deltaY * 0.0025), point.x, point.y);
    }, { passive: false });

    root.querySelectorAll('[data-kg-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        var box = size();
        var action = button.getAttribute('data-kg-action');
        if (action === 'zoom-in') zoomAt(1.25, box.w / 2, box.h / 2);
        else if (action === 'zoom-out') zoomAt(0.8, box.w / 2, box.h / 2);
        else { interacted = false; reset(); }
      });
    });

    reset();
    if (window.ResizeObserver) {
      new ResizeObserver(function () { if (!interacted) reset(); }).observe(stage);
    }
    var list = root.querySelector('.kg-list');
    if (list && window.matchMedia && window.matchMedia('(max-width: 720px)').matches) list.open = true;
    root.classList.add('is-ready');
  }

  document.querySelectorAll('[data-knowledge-graph]').forEach(init);
})();
